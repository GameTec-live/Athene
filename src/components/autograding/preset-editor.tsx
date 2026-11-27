import { CodeIcon, LayoutGridIcon, UploadIcon } from "lucide-react";
import { lazy, Suspense, useId, useRef, useState } from "react";
import * as v from "valibot";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Spinner } from "#/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { toast } from "#/components/ui/toast";
import { saveAutogradingPreset } from "#/lib/autograding/autograding.functions";
import {
    type ConfigDraft,
    draftToConfig,
    draftToJson,
    parseDraft,
} from "#/lib/autograding/draft";
import { parseConfig, presetSchema } from "#/lib/autograding/schemas";
import { VisualEditor } from "./visual-editor";

const MonacoEditor = lazy(() => import("./monaco-editor"));
type EditorMode = "visual" | "monaco";
type EditorValue =
    | { mode: "visual"; value: ConfigDraft }
    | { mode: "monaco"; value: string };
const editorCookie = "athene-autograding-editor";
const defaultConfig = {
    grading: [{ name: "", command: "", codes: { "0": 1, "1": 0 } }],
    overlays: [],
};

function preferredEditor(): EditorMode {
    if (typeof document === "undefined") return "visual";
    return document.cookie
        .split(";")
        .some((cookie) => cookie.trim() === `${editorCookie}=monaco`)
        ? "monaco"
        : "visual";
}

function rememberEditor(mode: EditorMode) {
    // biome-ignore lint/suspicious/noDocumentCookie: Match the existing sidebar preference and support browsers without Cookie Store.
    document.cookie = `${editorCookie}=${mode}; path=/; max-age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export function PresetEditor({
    preset,
    onClose,
    onSaved,
}: {
    preset?: { id: string; name: string; configJson: string };
    onClose: () => void;
    onSaved: () => Promise<void>;
}) {
    const id = useId();
    const fileRef = useRef<HTMLInputElement>(null);
    const [editor, setEditor] = useState<EditorValue>(() => {
        const json =
            preset?.configJson ?? JSON.stringify(defaultConfig, null, 4);
        if (preferredEditor() === "visual") {
            const draft = parseDraft(json);
            if (draft) return { mode: "visual", value: draft };
        }
        return { mode: "monaco", value: json };
    });
    const [name, setName] = useState(preset?.name ?? "");
    const [errors, setErrors] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [monacoLoading, setMonacoLoading] = useState(true);

    function changeMode(next: EditorMode) {
        if (next === editor.mode) return;
        if (editor.mode === "monaco") {
            const draft = parseDraft(editor.value);
            if (!draft) {
                toast.add({
                    title: "Cannot open visual editor",
                    description:
                        "Fix JSON syntax or unsupported fields first. Your JSON has been kept.",
                    type: "error",
                });
                setErrors([]);
                return;
            }
            setEditor({ mode: "visual", value: draft });
        } else {
            const result = draftToJson(editor.value);
            if (!result.success) {
                setErrors(result.errors);
                return;
            }
            setMonacoLoading(true);
            setEditor({ mode: "monaco", value: result.json });
        }
        setErrors([]);
        rememberEditor(next);
    }

    async function upload(file: File) {
        try {
            const text = await file.text();
            const draft = parseDraft(text);
            if (!draft) {
                if (editor.mode !== "monaco") setMonacoLoading(true);
                setEditor({ mode: "monaco", value: text });
                rememberEditor("monaco");
                setErrors([]);
                return;
            }
            setEditor((current) =>
                current.mode === "monaco"
                    ? { mode: "monaco", value: text }
                    : { mode: "visual", value: draft },
            );
            if (!name.trim()) setName(file.name.replace(/\.json$/i, ""));
            setErrors([]);
        } catch {
            setErrors(["Could not read the JSON file."]);
        }
    }

    async function save() {
        const config =
            editor.mode === "visual"
                ? draftToConfig(editor.value)
                : parseConfig(editor.value);
        if (!config.success) {
            setErrors(editor.mode === "visual" ? config.errors : []);
            return;
        }
        const result = v.safeParse(presetSchema, {
            name,
            config: config.config,
        });
        if (!result.success) {
            setErrors(result.issues.map((issue) => issue.message));
            return;
        }
        setErrors([]);
        setSaving(true);
        try {
            await saveAutogradingPreset({
                data: { id: preset?.id, preset: result.output },
            });
        } catch {
            setErrors(["Could not save the preset. Please try again."]);
            setSaving(false);
            return;
        }
        await onSaved();
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open && !saving) onClose();
            }}
        >
            <DialogContent
                className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl"
                showCloseButton={!saving}
            >
                <DialogHeader>
                    <DialogTitle>
                        {preset
                            ? "Edit autograding preset"
                            : "New autograding preset"}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void save();
                    }}
                    noValidate
                >
                    <fieldset disabled={saving} className="min-w-0 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor={`${id}-name`}>Preset name</Label>
                            <Input
                                id={`${id}-name`}
                                value={name}
                                maxLength={255}
                                placeholder="Enter preset name"
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />
                        </div>
                        <Tabs
                            value={editor.mode}
                            onValueChange={(next) => {
                                if (next === "visual" || next === "monaco")
                                    changeMode(next);
                            }}
                            className="gap-5"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <TabsList aria-label="Preset editor">
                                    <TabsTrigger value="visual">
                                        <LayoutGridIcon />
                                        Visual editor
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="monaco"
                                        aria-busy={
                                            editor.mode === "monaco" &&
                                            monacoLoading
                                        }
                                    >
                                        {editor.mode === "monaco" &&
                                        monacoLoading ? (
                                            <Spinner className="size-3.5" />
                                        ) : (
                                            <CodeIcon className="size-3.5" />
                                        )}
                                        Monaco editor
                                    </TabsTrigger>
                                </TabsList>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".json,application/json"
                                    className="hidden"
                                    aria-label="Upload preset JSON"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) void upload(file);
                                        event.target.value = "";
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <UploadIcon />
                                    Upload JSON
                                </Button>
                            </div>
                            {errors.length > 0 && (
                                <div
                                    role="alert"
                                    className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-destructive"
                                >
                                    <ul className="list-inside list-disc">
                                        {[...new Set(errors)].map((error) => (
                                            <li key={error}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <TabsContent value="visual">
                                {editor.mode === "visual" && (
                                    <VisualEditor
                                        value={editor.value}
                                        onChange={(value) =>
                                            setEditor({ mode: "visual", value })
                                        }
                                    />
                                )}
                            </TabsContent>
                            <TabsContent value="monaco">
                                {editor.mode === "monaco" && (
                                    <Suspense
                                        fallback={<div className="h-[48vh]" />}
                                    >
                                        <MonacoEditor
                                            onLoadingChange={setMonacoLoading}
                                            value={editor.value}
                                            onChange={(value) =>
                                                setEditor({
                                                    mode: "monaco",
                                                    value,
                                                })
                                            }
                                        />
                                    </Suspense>
                                )}
                            </TabsContent>
                        </Tabs>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {saving ? "Saving…" : "Save preset"}
                            </Button>
                        </DialogFooter>
                    </fieldset>
                </form>
            </DialogContent>
        </Dialog>
    );
}
