import { XIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";
import type { ForgejoStudent } from "#/lib/assignments/types";
import { StudentAvatar } from "./student-search";

const NO_GROUP = "none";

export type MemberRow = { student: ForgejoStudent; group: number | null };

export function AssignmentMembersTable({
    rows,
    groups,
    showGroups,
    repositoryName,
    onGroupChange,
    onRemove,
}: {
    rows: MemberRow[];
    groups: string[];
    showGroups: boolean;
    repositoryName: (row: MemberRow) => string | null;
    onGroupChange: (forgejoId: number, group: number | null) => void;
    onRemove: (forgejoId: number) => void;
}) {
    const groupItems = [
        { value: NO_GROUP, label: "No group" },
        ...groups.map((name, index) => ({
            value: String(index),
            label: name || `Group ${index + 1}`,
        })),
    ];

    return (
        <div className="overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        {showGroups && <TableHead>Group</TableHead>}
                        <TableHead>Repository</TableHead>
                        <TableHead className="w-10">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={showGroups ? 5 : 4}
                                className="py-8 text-center text-muted-foreground"
                            >
                                No students assigned yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => (
                            <TableRow key={row.student.forgejoId}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <StudentAvatar student={row.student} />
                                        <div className="flex min-w-0 flex-col">
                                            <span className="truncate">
                                                {row.student.fullName}
                                            </span>
                                            <span className="truncate text-muted-foreground">
                                                @{row.student.username}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {row.student.email ?? "—"}
                                </TableCell>
                                {showGroups && (
                                    <TableCell>
                                        <Select
                                            items={groupItems}
                                            value={
                                                row.group === null
                                                    ? NO_GROUP
                                                    : String(row.group)
                                            }
                                            onValueChange={(value) =>
                                                onGroupChange(
                                                    row.student.forgejoId,
                                                    value && value !== NO_GROUP
                                                        ? Number(value)
                                                        : null,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className="w-40"
                                                aria-label={`Group of ${row.student.username}`}
                                                aria-invalid={
                                                    row.group === null
                                                }
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {groupItems.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                )}
                                <TableCell className="font-mono text-muted-foreground">
                                    {repositoryName(row) ?? "Created on join"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Remove ${row.student.username}`}
                                        onClick={() =>
                                            onRemove(row.student.forgejoId)
                                        }
                                    >
                                        <XIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
