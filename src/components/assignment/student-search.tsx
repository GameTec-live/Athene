import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox";
import { useDebouncedValue } from "#/hooks/use-debounced-value";
import { searchStudents } from "#/lib/assignments/assignments.functions";
import type { ForgejoStudent } from "#/lib/assignments/types";

export function StudentAvatar({ student }: { student: ForgejoStudent }) {
    return (
        <Avatar className="size-6">
            {student.avatarUrl && (
                <AvatarImage src={student.avatarUrl} alt="" />
            )}
            <AvatarFallback>
                {student.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}

/** Searches Forgejo users and reports the picked one; the input then resets. */
export function StudentSearch({
    id,
    excludeIds,
    onSelect,
}: {
    id?: string;
    excludeIds: Set<number>;
    onSelect: (student: ForgejoStudent) => void;
}) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query.trim());
    const [results, setResults] = useState<ForgejoStudent[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            setStatus("idle");
            return;
        }
        let cancelled = false;
        setStatus("loading");
        searchStudents({ data: { query: debouncedQuery } })
            .then((students) => {
                if (cancelled) return;
                setResults(students);
                setStatus("idle");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    const items = results.filter(
        (student) => !excludeIds.has(student.forgejoId),
    );

    return (
        <Combobox
            items={items}
            filter={null}
            value={null}
            inputValue={query}
            onInputValueChange={setQuery}
            itemToStringLabel={(student: ForgejoStudent) => student.username}
            isItemEqualToValue={(a: ForgejoStudent, b: ForgejoStudent) =>
                a.forgejoId === b.forgejoId
            }
            onValueChange={(student: ForgejoStudent | null) => {
                if (!student) return;
                onSelect(student);
                setQuery("");
            }}
        >
            <ComboboxInput
                id={id}
                aria-label="Search students"
                placeholder="Add student by name, username or email…"
                showTrigger={false}
                className="w-full"
            />
            <ComboboxContent>
                <ComboboxEmpty>
                    {!debouncedQuery
                        ? "Type to search Forgejo users."
                        : status === "loading"
                          ? "Searching…"
                          : status === "error"
                            ? "Unable to search users."
                            : "No matching users."}
                </ComboboxEmpty>
                <ComboboxList>
                    {(student: ForgejoStudent) => (
                        <ComboboxItem key={student.forgejoId} value={student}>
                            <StudentAvatar student={student} />
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate">
                                    {student.fullName}
                                    {student.fullName !== student.username && (
                                        <span className="text-muted-foreground">
                                            {" "}
                                            @{student.username}
                                        </span>
                                    )}
                                </span>
                                {student.email && (
                                    <span className="truncate text-muted-foreground">
                                        {student.email}
                                    </span>
                                )}
                            </div>
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
