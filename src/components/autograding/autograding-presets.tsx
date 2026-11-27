import { useRouter } from "@tanstack/react-router";
import {
    LayoutGridIcon,
    ListIcon,
    PlusIcon,
    SearchIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { PresetEditor } from "#/components/autograding/preset-editor";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "#/components/ui/input-group";
import { toast } from "#/components/ui/toast";
import {
    deleteAutogradingPreset,
    type getAutogradingPresets,
} from "#/lib/autograding/autograding.functions";
import { parseConfig } from "#/lib/autograding/schemas";

type Preset = Awaited<ReturnType<typeof getAutogradingPresets>>[number];

export function AutogradingPresets({ presets }: { presets: Preset[] }) {
    const router = useRouter();
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const [editing, setEditing] = useState<Preset | "new" | null>(null);
    const [deleting, setDeleting] = useState<Preset | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const filteredPresets = presets.filter((preset) =>
        preset.name.toLowerCase().includes(query),
    );

    async function refresh() {
        try {
            await router.invalidate({
                filter: (match) =>
                    match.routeId === "/_authenticated/dashboard/autograding",
                sync: true,
            });
        } catch {
            toast.add({
                title: "Preset changes were saved, but could not be refreshed",
                description: "Reload the page to see the latest presets.",
                type: "error",
            });
        }
    }

    async function remove() {
        if (!deleting) return;
        setIsDeleting(true);
        try {
            const result = await deleteAutogradingPreset({
                data: { id: deleting.id },
            });
            if (result.status === "in-use") {
                toast.add({
                    title: "Preset is used by an assignment",
                    description:
                        "Remove it from its assignments before deleting it.",
                    type: "error",
                });
            } else {
                setDeleting(null);
                await refresh();
            }
        } catch {
            toast.add({ title: "Could not delete preset", type: "error" });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="@container space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                <div className="mr-auto">
                    <h1 className="text-xl font-semibold">
                        Autograding presets
                    </h1>
                </div>
                <InputGroup className="order-last w-full @3xl:order-0 @3xl:w-64">
                    <InputGroupInput
                        type="search"
                        aria-label="Search presets"
                        placeholder="Search presets..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                        <SearchIcon aria-hidden="true" />
                    </InputGroupAddon>
                </InputGroup>
                <div className="flex items-center gap-2">
                    <fieldset className="flex gap-1" aria-label="Preset layout">
                        <Button
                            variant={layout === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            aria-label="Grid view"
                            aria-pressed={layout === "grid"}
                            onClick={() => setLayout("grid")}
                        >
                            <LayoutGridIcon />
                        </Button>
                        <Button
                            variant={layout === "list" ? "secondary" : "ghost"}
                            size="icon"
                            aria-label="List view"
                            aria-pressed={layout === "list"}
                            onClick={() => setLayout("list")}
                        >
                            <ListIcon />
                        </Button>
                    </fieldset>
                    <Button onClick={() => setEditing("new")}>
                        <PlusIcon />
                        New preset
                    </Button>
                </div>
            </div>
            {filteredPresets.length === 0 ? (
                <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                    {presets.length === 0
                        ? "No autograding presets yet. Create a preset to get started."
                        : "No presets match your search."}
                </div>
            ) : (
                <div
                    className={
                        layout === "grid"
                            ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                            : "flex flex-col gap-3"
                    }
                >
                    {filteredPresets.map((preset) => {
                        const config = parseConfig(preset.configJson);
                        return (
                            <Card
                                key={preset.id}
                                className="relative p-0 transition-shadow hover:ring-foreground/30"
                            >
                                <button
                                    type="button"
                                    className={`w-full rounded-lg p-5 pr-14 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${layout === "grid" ? "min-h-28" : "flex flex-wrap items-center justify-between gap-2"}`}
                                    onClick={() => setEditing(preset)}
                                >
                                    <span className="block">
                                        <span className="block break-words font-medium">
                                            {preset.name}
                                        </span>
                                        <span className="mt-1 block text-sm text-muted-foreground">
                                            Created on{" "}
                                            <time
                                                dateTime={preset.createdAt.toISOString()}
                                            >
                                                {preset.createdAt.toLocaleDateString()}
                                            </time>
                                        </span>
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        {config.success
                                            ? `${config.config.grading.length} tasks · ${config.config.maxPoints === undefined ? "No maximum points" : `${config.config.maxPoints} max points`}`
                                            : "Configuration needs attention"}
                                    </span>
                                </button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-3 bottom-3"
                                    aria-label={`Delete ${preset.name}`}
                                    onClick={() => setDeleting(preset)}
                                >
                                    <Trash2Icon />
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            )}
            {editing && (
                <PresetEditor
                    preset={editing === "new" ? undefined : editing}
                    onClose={() => setEditing(null)}
                    onSaved={async () => {
                        setEditing(null);
                        await refresh();
                    }}
                />
            )}
            <AlertDialog
                open={!!deleting}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setDeleting(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete preset?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently deletes “{deleting?.name}”. Presets
                            used by assignments cannot be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            disabled={isDeleting}
                            onClick={() => setDeleting(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => void remove()}
                        >
                            {isDeleting ? "Deleting…" : "Delete preset"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
