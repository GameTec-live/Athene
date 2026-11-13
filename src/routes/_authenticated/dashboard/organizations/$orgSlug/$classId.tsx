import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRightIcon,
    SearchIcon,
    UserGroupIcon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";
import { AssignmentCapabilityChip } from "#/components/assignment/assignment-capability-chip";
import { Button } from "#/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "#/components/ui/empty";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "#/components/ui/input-group";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "#/components/ui/tooltip";
import { getClassAssignments } from "#/lib/classes.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId",
)({
    loader: ({ params }) => getClassAssignments({ data: params }),
    component: ClassContent,
});

function ClassContent() {
    const { classroom, assignments } = Route.useLoaderData();

    // Reset the search when switching classes within this route.
    return (
        <ClassAssignments
            key={classroom.id}
            classroom={classroom}
            assignments={assignments}
        />
    );
}

function ClassAssignments({
    classroom,
    assignments,
}: Awaited<ReturnType<typeof getClassAssignments>>) {
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const filteredAssignments = assignments.filter((assignment) =>
        assignment.name.toLowerCase().includes(query),
    );

    return (
        <section
            className="@container space-y-6"
            aria-label={`${classroom.name} assignments`}
        >
            <div className="flex flex-wrap items-center gap-4">
                <h1 className="mr-auto text-xl font-semibold">
                    {classroom.name}
                </h1>
                <InputGroup className="order-last w-full @2xl:order-0 @2xl:w-64">
                    <InputGroupInput
                        type="search"
                        aria-label="Search assignments"
                        placeholder="Search assignments..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                        <SearchIcon aria-hidden="true" />
                    </InputGroupAddon>
                </InputGroup>
                <Button
                    render={<Link to="/dashboard/assignment/new" />}
                    nativeButton={false}
                >
                    New
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Button>
            </div>

            {filteredAssignments.length > 0 ? (
                <ul className="grid grid-cols-1 gap-6 @[28rem]:grid-cols-2 @[44rem]:grid-cols-3">
                    {filteredAssignments.map((assignment) => (
                        <li key={assignment.id}>
                            <Link
                                to="/dashboard/assignment/$id"
                                params={{ id: assignment.id }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="wrap-break-word">
                                            {assignment.name}
                                        </CardTitle>
                                        <CardDescription>
                                            by {assignment.creatorName} on{" "}
                                            {assignment.createdAt.toLocaleDateString()}
                                        </CardDescription>
                                        <CardAction>
                                            <AssignmentCapabilityChip
                                                assignment={assignment}
                                            />
                                        </CardAction>
                                    </CardHeader>
                                    <CardFooter>
                                        <div className="flex w-full items-center gap-2 justify-between">
                                            {assignment.type === "group" ? (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <UserGroupIcon className="h-4 w-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Group assignment
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <UserIcon className="h-4 w-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Individual assignment
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            {assignment.deadline && (
                                                <span className="text-sm text-muted-foreground">
                                                    Due{" "}
                                                    {assignment.deadline.toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>
                            {query
                                ? "No assignments found"
                                : "No assignments yet"}
                        </EmptyTitle>
                        <EmptyDescription>
                            {query
                                ? "Try searching for a different assignment name."
                                : "Assignments for this class will appear here."}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </section>
    );
}
