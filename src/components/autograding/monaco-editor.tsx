import Editor, { loader, type OnMount } from "@monaco-editor/react";
import { RotateCwIcon } from "lucide-react";
import * as monaco from "monaco-editor/editor/editor.api";
import "monaco-editor/editor/browser/coreCommands.js";
import "monaco-editor/editor/contrib/clipboard/browser/clipboard.js";
import "monaco-editor/editor/contrib/find/browser/findController.js";
import "monaco-editor/editor/contrib/format/browser/formatActions.js";
import "monaco-editor/editor/contrib/hover/browser/hoverContribution.js";
import "monaco-editor/editor/contrib/snippet/browser/snippetController2.js";
import "monaco-editor/editor/contrib/suggest/browser/suggestController.js";
import "monaco-editor/editor/contrib/tokenization/browser/tokenization.js";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import { useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { getAutogradingRepositories } from "#/lib/autograding/autograding.functions";
import { getConfigCompletions } from "#/lib/autograding/completions";
import { getConfigDiagnostics } from "#/lib/autograding/diagnostics";

// Bundle Monaco and its worker locally instead of depending on the loader's CDN.
self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });

const languageId = "athene-autograding";
monaco.languages.register({ id: languageId });
monaco.languages.setMonarchTokensProvider(languageId, {
    tokenizer: {
        root: [
            [
                /"(?:grading|maxPoints|overlays|name|command|codes)"(?=\s*:)/,
                "keyword",
            ],
            [/"(?:[^"\\]|\\.)*"(?=\s*:)/, "type.identifier"],
            [/"/, "string", "@string"],
            [/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number"],
            [/\b(?:true|false|null)\b/, "keyword"],
            [/[{}[\]]/, "@brackets"],
            [/[,:]/, "delimiter"],
            [/\s+/, "white"],
            [/./, "invalid"],
        ],
        string: [
            [/[^\\"]+/, "string"],
            [/\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/, "string.escape"],
            [/\\./, "invalid"],
            [/"/, "string", "@pop"],
        ],
    },
});
monaco.languages.setLanguageConfiguration(languageId, {
    brackets: [
        ["{", "}"],
        ["[", "]"],
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: '"', close: '"' },
    ],
});
monaco.languages.registerDocumentFormattingEditProvider(languageId, {
    provideDocumentFormattingEdits(model) {
        try {
            return [
                {
                    range: model.getFullModelRange(),
                    text: JSON.stringify(JSON.parse(model.getValue()), null, 4),
                },
            ];
        } catch {
            return [];
        }
    },
});

type Repository = Awaited<
    ReturnType<typeof getAutogradingRepositories>
>[number];

export default function MonacoEditor({
    value,
    onChange,
    onLoadingChange,
}: {
    value: string;
    onChange: (value: string) => void;
    onLoadingChange: (loading: boolean) => void;
}) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const repositories = useRef<Repository[]>([]);
    const [repositoryState, setRepositoryState] = useState<
        "loading" | "error" | "ready"
    >("loading");

    async function loadRepositories() {
        const editor = editorRef.current;
        if (!editor) return;
        setRepositoryState("loading");
        onLoadingChange(true);
        try {
            const repos = await getAutogradingRepositories();
            if (editorRef.current !== editor) return;
            repositories.current = repos;
            setRepositoryState("ready");
        } catch {
            if (editorRef.current === editor) setRepositoryState("error");
        } finally {
            if (editorRef.current === editor) onLoadingChange(false);
        }
    }

    const onMount: OnMount = (editor) => {
        editorRef.current = editor;
        const provider = monaco.languages.registerCompletionItemProvider(
            languageId,
            {
                triggerCharacters: ['"', "/"],
                provideCompletionItems(model, position) {
                    if (model !== editor.getModel()) return { suggestions: [] };
                    const result = getConfigCompletions(
                        model.getValue(),
                        model.getOffsetAt(position),
                        repositories.current,
                    );
                    const start = model.getPositionAt(result.start);
                    const end = model.getPositionAt(result.end);
                    const range = new monaco.Range(
                        start.lineNumber,
                        start.column,
                        end.lineNumber,
                        end.column,
                    );
                    return {
                        suggestions: result.suggestions.map(
                            ({ kind, snippet, ...item }) => ({
                                ...item,
                                kind:
                                    kind === "repository"
                                        ? monaco.languages.CompletionItemKind
                                              .Reference
                                        : monaco.languages.CompletionItemKind
                                              .Property,
                                insertTextRules: snippet
                                    ? monaco.languages
                                          .CompletionItemInsertTextRule
                                          .InsertAsSnippet
                                    : undefined,
                                range,
                            }),
                        ),
                    };
                },
            },
        );
        const subscription = editor.onDidChangeModelContent(() =>
            validateEditor(editor),
        );
        editor.onDidDispose(() => {
            provider.dispose();
            subscription.dispose();
            if (editorRef.current === editor) editorRef.current = null;
        });
        validateEditor(editor);
        void loadRepositories();
    };
    return (
        <div className="relative h-[48vh] overflow-hidden rounded-md border">
            {repositoryState === "error" && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    aria-label="Retry loading repositories"
                    title="Could not load repositories. Retry."
                    onClick={() => void loadRepositories()}
                >
                    <RotateCwIcon />
                </Button>
            )}
            <Editor
                loading={null}
                height="100%"
                language={languageId}
                value={value}
                onChange={(text) => onChange(text ?? "")}
                onMount={onMount}
                theme={
                    document.documentElement.classList.contains("dark")
                        ? "vs-dark"
                        : "light"
                }
                options={{
                    automaticLayout: true,
                    minimap: { enabled: false },
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    renderValidationDecorations: "on",
                    hover: { enabled: "on" },
                    quickSuggestions: {
                        strings: true,
                        other: true,
                        comments: false,
                    },
                    ariaLabel: "Autograding preset JSON",
                }}
            />
        </div>
    );
}

function validateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    const model = editor.getModel();
    if (!model) return;
    monaco.editor.setModelMarkers(
        model,
        languageId,
        getConfigDiagnostics(model.getValue()).map(
            ({ message, offset, length }) => {
                const start = model.getPositionAt(offset);
                const end = model.getPositionAt(offset + length);
                return {
                    severity: monaco.MarkerSeverity.Error,
                    message,
                    startLineNumber: start.lineNumber,
                    startColumn: start.column,
                    endLineNumber: end.lineNumber,
                    endColumn:
                        end.lineNumber === start.lineNumber
                            ? Math.max(start.column + 1, end.column)
                            : end.column,
                };
            },
        ),
    );
}
