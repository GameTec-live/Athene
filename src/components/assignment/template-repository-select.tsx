import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox";
import { useDebouncedValue } from "#/hooks/use-debounced-value";
import { searchTemplateRepositories } from "#/lib/assignments/assignments.functions";

type TemplateRepository = Awaited<
    ReturnType<typeof searchTemplateRepositories>
>[number];

export function TemplateRepositorySelect({
    id,
    orgSlug,
    value,
    onChange,
}: {
    id: string;
    orgSlug: string;
    value: string | null;
    onChange: (value: string | null) => void;
}) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query);
    const [results, setResults] = useState<TemplateRepository[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setStatus("loading");
        searchTemplateRepositories({
            data: {
                orgSlug,
                // The input shows the selected value; search everything then.
                query: debouncedQuery === value ? "" : debouncedQuery,
            },
        })
            .then((repos) => {
                if (cancelled) return;
                setResults(repos);
                setStatus("idle");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [open, orgSlug, debouncedQuery, value]);

    const items = results.map((repo) => repo.fullName);
    if (value && !items.includes(value)) items.unshift(value);
    const details = new Map(results.map((repo) => [repo.fullName, repo]));

    return (
        <Combobox
            items={items}
            filter={null}
            value={value}
            onValueChange={(next) => onChange(next ?? null)}
            onInputValueChange={setQuery}
            open={open}
            onOpenChange={setOpen}
        >
            <ComboboxInput
                id={id}
                placeholder="No template (empty repository)"
                showClear={!!value}
            />
            <ComboboxContent>
                <ComboboxEmpty>
                    {status === "loading"
                        ? "Searching…"
                        : status === "error"
                          ? "Unable to search repositories."
                          : "No template repositories found."}
                </ComboboxEmpty>
                <ComboboxList>
                    {(fullName: string) => {
                        const repo = details.get(fullName);
                        return (
                            <ComboboxItem key={fullName} value={fullName}>
                                <div className="flex min-w-0 flex-col pr-5">
                                    <span className="flex items-center gap-1 truncate">
                                        {fullName}
                                        {repo?.private && (
                                            <LockIcon
                                                className="size-3 text-muted-foreground"
                                                aria-label="Private"
                                            />
                                        )}
                                    </span>
                                    {repo?.description && (
                                        <span className="truncate text-muted-foreground">
                                            {repo.description}
                                        </span>
                                    )}
                                </div>
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
