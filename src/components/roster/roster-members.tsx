import { useRouter } from "@tanstack/react-router";
import {
    type ColumnDef,
    columnFilteringFeature,
    createFilteredRowModel,
    createSortedRowModel,
    flexRender,
    globalFilteringFeature,
    rowSortingFeature,
    type SortingState,
    sortFns,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    MoreHorizontalIcon,
    SearchIcon,
    Trash2Icon,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import {
    addRosterMember,
    type getRoster,
    removeRosterMember,
} from "#/lib/rosters.functions";
import { AddRosterMemberDialog } from "./add-roster-member-dialog";
import { UploadRosterCsvDialog } from "./upload-roster-csv-dialog";

const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    sortFns,
});

export type RosterMember = Awaited<
    ReturnType<typeof getRoster>
>["members"][number];

export function RosterMembers({
    roster,
    members,
}: Awaited<ReturnType<typeof getRoster>>) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "username", desc: false },
    ]);
    const [busy, setBusy] = useState(false);
    const locked = useRef(false);

    const begin = useCallback(() => {
        if (locked.current) return false;
        locked.current = true;
        setBusy(true);
        return true;
    }, []);
    const end = useCallback(() => {
        locked.current = false;
        setBusy(false);
    }, []);
    const refresh = useCallback(async () => {
        try {
            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                        "/_authenticated/dashboard/rosters/$rosterId" &&
                    match.params.rosterId === roster.id,
                sync: true,
            });
        } catch {
            toast.add({
                title: "Members were saved, but could not be refreshed",
                description: "Reload the page to see the latest member list.",
                type: "error",
            });
        }
    }, [router, roster.id]);
    const columns = useMemo<ColumnDef<typeof features, RosterMember>[]>(
        () => [
            {
                accessorKey: "username",
                header: "Name / Username",
                sortFn: "alphanumeric",
                cell: ({ row }) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                            {row.original.name ?? row.original.username}
                        </span>
                        {row.original.name &&
                            row.original.name !== row.original.username && (
                                <span className="text-xs text-muted-foreground">
                                    {row.original.username}
                                </span>
                            )}
                    </div>
                ),
            },
            { accessorKey: "email", header: "Email", enableSorting: false },
            {
                accessorKey: "addedOn",
                header: "Added on",
                enableSorting: false,
                cell: ({ row }) => (
                    <time
                        dateTime={new Date(row.original.addedOn).toISOString()}
                    >
                        {new Date(row.original.addedOn).toLocaleDateString(
                            "en-GB",
                        )}
                    </time>
                ),
            },
            {
                id: "actions",
                header: () => <span className="sr-only">Actions</span>,
                enableSorting: false,
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" />}
                            disabled={busy}
                            aria-label={`Actions for ${row.original.username}`}
                        >
                            <MoreHorizontalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={async () => {
                                    if (!begin()) return;
                                    try {
                                        await removeRosterMember({
                                            data: {
                                                rosterId: roster.id,
                                                memberId: row.original.id,
                                            },
                                        });
                                        toast.add({
                                            title: "Member removed",
                                            type: "success",
                                        });
                                        await refresh();
                                    } catch {
                                        toast.add({
                                            title: "Failed to remove member",
                                            type: "error",
                                        });
                                    } finally {
                                        end();
                                    }
                                }}
                            >
                                <Trash2Icon />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [busy, roster.id, begin, end, refresh],
    );
    const table = useTable({
        features,
        data: members,
        columns,
        state: { sorting, globalFilter: search },
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearch,
        enableSortingRemoval: false,
        globalFilterFn: (row, _columnId, value: string) =>
            `${row.original.username} ${row.original.name ?? ""} ${row.original.email}`
                .toLowerCase()
                .includes(value.trim().toLowerCase()),
        getRowId: (row) => row.id,
    });
    const dialogProps = {
        rosterId: roster.id,
        members,
        busy,
        begin,
        end,
        refresh,
        add: (email: string) =>
            addRosterMember({ data: { rosterId: roster.id, email } }),
    };
    return (
        <section className="space-y-6" aria-labelledby="roster-heading">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 id="roster-heading" className="text-xl font-semibold">
                        {roster.name}
                    </h1>
                    <p className="text-sm text-muted-foreground" role="status">
                        {members.length}{" "}
                        {members.length === 1 ? "member" : "members"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <UploadRosterCsvDialog
                        {...dialogProps}
                        rosterName={roster.name}
                    />
                    <AddRosterMemberDialog {...dialogProps} />
                </div>
            </div>
            <div className="relative max-w-sm">
                <SearchIcon className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                    className="pl-9"
                    aria-label="Search members"
                    placeholder="Search members…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                    <caption className="sr-only">
                        Members of {roster.name}
                    </caption>
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        {table.getHeaderGroups().map((group) => (
                            <tr key={group.id}>
                                {group.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className="px-4 py-3 font-medium"
                                        aria-sort={
                                            header.column.getCanSort()
                                                ? header.column.getIsSorted() ===
                                                  "desc"
                                                    ? "descending"
                                                    : "ascending"
                                                : undefined
                                        }
                                    >
                                        {header.column.getCanSort() ? (
                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-sm outline-offset-4 focus-visible:outline-2"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getIsSorted() ===
                                                "desc" ? (
                                                    <ArrowDownIcon
                                                        aria-hidden="true"
                                                        className="size-4"
                                                    />
                                                ) : (
                                                    <ArrowUpIcon
                                                        aria-hidden="true"
                                                        className="size-4"
                                                    />
                                                )}
                                            </button>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/30">
                                {row.getAllCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-3">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!table.getRowModel().rows.length && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="p-10 text-center text-muted-foreground"
                                >
                                    {search
                                        ? "No matching members."
                                        : "No members yet. Add a member or upload a CSV to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export type MembershipDialogProps = {
    rosterId: string;
    members: RosterMember[];
    busy: boolean;
    begin: () => boolean;
    end: () => void;
    refresh: () => Promise<void>;
    add: (email: string) => Promise<"added" | "already-member" | "not-found">;
};
