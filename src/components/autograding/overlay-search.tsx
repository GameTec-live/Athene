import { FolderGit2Icon, LinkIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox";
import { getAutogradingRepositories } from "#/lib/autograding/autograding.functions";
import { overlayUrlSchema } from "#/lib/autograding/schemas";

type Repository = Awaited<
    ReturnType<typeof getAutogradingRepositories>
>[number];
type OverlayOption = {
    id: string;
    label: string;
    url: string;
    branch?: string;
    private?: boolean;
};

export function OverlaySearch({
    onSelect,
}: {
    onSelect: (url: string) => void;
}) {
    const [query, setQuery] = useState("");
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [status, setStatus] = useState<
        "idle" | "loading" | "ready" | "error"
    >("idle");

    async function loadRepositories() {
        if (status === "loading" || status === "ready") return;
        setStatus("loading");
        try {
            setRepositories(await getAutogradingRepositories());
            setStatus("ready");
        } catch {
            setStatus("error");
        }
    }

    const keyword = query.trim().toLowerCase();
    const url = v.safeParse(overlayUrlSchema, query.trim());
    const items: OverlayOption[] = url.success
        ? [{ id: "url", label: url.output, url: url.output }]
        : keyword
          ? repositories
                .filter((repo) => repo.fullName.toLowerCase().includes(keyword))
                .map((repo) => ({
                    id: String(repo.id),
                    label: repo.fullName,
                    url: `${repo.url}/overlays@${repo.defaultBranch}`,
                    branch: repo.defaultBranch,
                    private: repo.private,
                }))
          : [];
    return (
        <Combobox
            autoHighlight
            filter={null}
            value={null}
            inputValue={query}
            onInputValueChange={setQuery}
            items={items}
            itemToStringLabel={(item: OverlayOption) => item.label}
            isItemEqualToValue={(a: OverlayOption, b: OverlayOption) =>
                a.id === b.id
            }
            onOpenChange={(open) => {
                if (open) void loadRepositories();
            }}
            onValueChange={(item: OverlayOption | null) => {
                if (!item) return;
                onSelect(item.url);
                setQuery("");
            }}
        >
            <ComboboxInput
                aria-label="Add overlay"
                placeholder="Search a repository or paste an overlay URL…"
                showTrigger={false}
                className="w-full"
            />
            <ComboboxContent className="min-w-0">
                <ComboboxEmpty>
                    {!keyword
                        ? "Search a repository or paste a complete overlay URL."
                        : status === "loading"
                          ? "Loading repositories…"
                          : status === "error"
                            ? "Unable to load repositories. Close and reopen to retry."
                            : "No matching repositories. You can also paste a complete overlay URL."}
                </ComboboxEmpty>
                <ComboboxList className="max-h-[min(12rem,calc(var(--available-height)-0.5rem))]">
                    {(item: OverlayOption) => (
                        <ComboboxItem key={item.id} value={item}>
                            {item.branch ? (
                                <FolderGit2Icon className="size-5 shrink-0 text-muted-foreground" />
                            ) : (
                                <LinkIcon className="size-5 shrink-0 text-muted-foreground" />
                            )}
                            <div className="flex min-w-0 flex-col pr-5">
                                <span className="flex items-center gap-1 truncate">
                                    {item.label}
                                    {item.private && (
                                        <LockIcon
                                            className="size-3 shrink-0"
                                            aria-label="Private repository"
                                        />
                                    )}
                                </span>
                                <span className="truncate text-muted-foreground">
                                    {item.branch ?? "Add this URL"}
                                </span>
                            </div>
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
