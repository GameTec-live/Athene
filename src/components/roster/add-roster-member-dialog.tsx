import { PlusIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog";
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import { searchRosterUsers } from "#/lib/rosters.functions";
import type { MembershipDialogProps } from "./roster-members";

type SearchResult = Awaited<ReturnType<typeof searchRosterUsers>>[number];

export function AddRosterMemberDialog({
    rosterId,
    members,
    busy,
    begin,
    end,
    refresh,
    add,
}: MembershipDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
    const request = useRef(0);
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const version = ++request.current;
        const keyword = query.trim();
        if (!open || !keyword) return;
        const timer = setTimeout(async () => {
            try {
                const data = await searchRosterUsers({
                    data: { rosterId, query: keyword },
                });
                if (request.current === version) setResults(data);
            } catch {
                if (request.current === version)
                    setError(
                        "Could not search users. Try again or check your Forgejo connection.",
                    );
            } finally {
                if (request.current === version) setSearching(false);
            }
        }, 300);
        return () => {
            clearTimeout(timer);
            request.current++;
        };
    }, [open, query, rosterId]);

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                request.current++;
                setOpen(next);
                if (next) setAddedIds(new Set());
                setQuery("");
                setResults([]);
                setError("");
                setMessage("");
                setSearching(false);
            }}
        >
            <DialogTrigger render={<Button />} disabled={busy}>
                <PlusIcon />
                Add Member
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg" initialFocus={inputRef}>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Search Forgejo email addresses to add a member to this
                        roster.
                    </DialogDescription>
                </DialogHeader>
                <Field>
                    <FieldLabel htmlFor={inputId}>Email address</FieldLabel>
                    <Input
                        ref={inputRef}
                        id={inputId}
                        type="search"
                        autoComplete="off"
                        placeholder="Search by email…"
                        value={query}
                        onChange={(event) => {
                            request.current++;
                            setQuery(event.target.value);
                            setResults([]);
                            setError("");
                            setMessage("");
                            setSearching(Boolean(event.target.value.trim()));
                        }}
                    />
                </Field>
                {searching && (
                    <p role="status" className="text-muted-foreground">
                        Searching…
                    </p>
                )}
                {error && (
                    <p role="alert" className="text-destructive">
                        {error}
                    </p>
                )}
                {message && <p role="status">{message}</p>}
                {!searching &&
                    !error &&
                    query.trim() &&
                    results.length === 0 && (
                        <p role="status" className="text-muted-foreground">
                            No matching users.
                        </p>
                    )}
                {!query.trim() && (
                    <p className="text-muted-foreground">
                        Enter an email address to find users.
                    </p>
                )}
                {results.length > 0 && (
                    <ul
                        aria-label="Matching users"
                        className="max-h-72 divide-y overflow-y-auto rounded-md border [scrollbar-gutter:stable]"
                    >
                        {results.map((result) => {
                            const isMember =
                                addedIds.has(result.user_id) ||
                                members.some(
                                    (member) =>
                                        member.forgejoUserId ===
                                            result.user_id ||
                                        member.email.toLowerCase() ===
                                            result.email.toLowerCase(),
                                );
                            return (
                                <li key={`${result.user_id}-${result.email}`}>
                                    <button
                                        type="button"
                                        disabled={busy || isMember}
                                        className="flex w-full items-center justify-between gap-3 p-3 pr-5 text-left hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:opacity-60"
                                        onClick={async () => {
                                            if (!begin()) return;
                                            setAdding(result.user_id);
                                            setError("");
                                            setMessage("");
                                            try {
                                                const outcome = await add(
                                                    result.email,
                                                );
                                                if (outcome === "not-found")
                                                    throw new Error(
                                                        "User no longer exists.",
                                                    );
                                                setAddedIds(
                                                    (ids) =>
                                                        new Set([
                                                            ...ids,
                                                            result.user_id,
                                                        ]),
                                                );
                                                const text =
                                                    outcome === "added"
                                                        ? `${result.username} added.`
                                                        : `${result.username} is already a member.`;
                                                setMessage(text);
                                                toast.add({
                                                    title: text,
                                                    type: "success",
                                                });
                                                await refresh();
                                            } catch {
                                                setError(
                                                    `Could not add ${result.username}. Try again or check your Forgejo connection.`,
                                                );
                                            } finally {
                                                setAdding(null);
                                                end();
                                            }
                                        }}
                                    >
                                        <span className="min-w-0 wrap-break-word">
                                            <span className="block font-medium">
                                                {result.username}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {result.email}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-muted-foreground">
                                            {isMember ? (
                                                "Already a member"
                                            ) : adding === result.user_id ? (
                                                "Adding…"
                                            ) : (
                                                <>
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="size-4"
                                                    />
                                                    <span className="sr-only">
                                                        Add member
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
                {results.length === 50 && (
                    <p className="text-muted-foreground">
                        Showing the first 50 matches. Refine your search to find
                        a specific email.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
