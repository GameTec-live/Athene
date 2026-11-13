import { useRouter } from "@tanstack/react-router";
import { ExternalLinkIcon, UsersIcon } from "lucide-react";
import { useId, useState } from "react";
import * as v from "valibot";
import { Alert, AlertDescription } from "#/components/ui/alert";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarImage,
} from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import type { getJoinInfo } from "#/lib/assignments/join.functions";
import { joinAssignment } from "#/lib/assignments/join.functions";
import { customNameSchema, groupNameSchema } from "#/lib/assignments/schemas";

type JoinInfo = Awaited<ReturnType<typeof getJoinInfo>>;
type JoinRequest = Parameters<typeof joinAssignment>[0]["data"];

function firstIssue(schema: v.GenericSchema, value: string) {
    const result = v.safeParse(schema, value);
    return result.success ? undefined : result.issues[0].message;
}

export function JoinAssignment({
    code,
    info,
}: {
    code: string;
    info: JoinInfo;
}) {
    const id = useId();
    const router = useRouter();
    const [customName, setCustomName] = useState("");
    const [groupName, setGroupName] = useState("");
    const [pending, setPending] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        custom?: string;
        group?: string;
    }>({});
    const a = info.assignment;
    const isGroup = a.type === "group";

    async function submit(
        key: string,
        request: JoinRequest,
        needsCustom: boolean,
    ) {
        const errors = {
            custom: needsCustom
                ? firstIssue(customNameSchema, customName)
                : undefined,
            group:
                request.action === "create-group"
                    ? firstIssue(groupNameSchema, groupName)
                    : undefined,
        };
        setFieldErrors(errors);
        if (errors.custom || errors.group) return;

        setPending(key);
        setError(null);
        try {
            const result = await joinAssignment({
                data: {
                    ...request,
                    customName: needsCustom ? customName.trim() : null,
                } as JoinRequest,
            });
            if (!result.success) {
                setError(result.error);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setPending(null);
            await router.invalidate();
        }
    }

    const header = (
        <CardHeader>
            <CardDescription>
                {a.orgName} · {a.className}
            </CardDescription>
            <CardTitle className="text-xl">{a.name}</CardTitle>
            <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">
                    {isGroup ? "Group assignment" : "Individual assignment"}
                </Badge>
                {a.deadline && (
                    <Badge variant="outline">
                        Due {new Date(a.deadline).toLocaleString()}
                    </Badge>
                )}
                {info.groupName && <Badge>{info.groupName}</Badge>}
            </div>
        </CardHeader>
    );

    if (info.status === "joined" && info.repositoryUrl) {
        return (
            <Card className="w-full max-w-xl">
                {header}
                <CardContent>
                    <p className="text-sm">
                        You have joined this assignment. Your repository is
                        ready.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        nativeButton={false}
                        render={<a href={info.repositoryUrl} />}
                    >
                        Open repository
                        <ExternalLinkIcon data-icon="inline-end" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (info.status === "closed" || info.status === "restricted") {
        return (
            <Card className="w-full max-w-xl">
                {header}
                <CardContent>
                    <Alert>
                        <AlertDescription>
                            {info.status === "closed"
                                ? "The deadline for this assignment has passed, so it can no longer be joined."
                                : "This assignment is only open to students on a specific roster. Contact your teacher if you think this is a mistake."}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const customField = (
        <Field data-invalid={!!fieldErrors.custom}>
            <FieldLabel htmlFor={`${id}-custom`}>Name</FieldLabel>
            <Input
                id={`${id}-custom`}
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                aria-invalid={!!fieldErrors.custom}
                autoComplete="off"
                placeholder="my-project"
            />
            <FieldDescription>Used in your repository name.</FieldDescription>
            {fieldErrors.custom && (
                <FieldError errors={[{ message: fieldErrors.custom }]} />
            )}
        </Field>
    );

    const errorAlert = error && (
        <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );

    // Individual students, and group members whose group still lacks a repository.
    if (!isGroup || info.status === "pending") {
        return (
            <Card className="w-full max-w-xl">
                {header}
                <CardContent>
                    <FieldGroup>
                        {info.status === "pending" &&
                            info.provisioningError && (
                                <Alert>
                                    <AlertDescription>
                                        Creating your repository failed last
                                        time. Please try again.
                                    </AlertDescription>
                                </Alert>
                            )}
                        {info.needsCustom && customField}
                        {errorAlert}
                    </FieldGroup>
                </CardContent>
                <CardFooter>
                    <Button
                        disabled={pending !== null}
                        onClick={() =>
                            submit(
                                "accept",
                                { code, action: "accept", customName: null },
                                info.needsCustom,
                            )
                        }
                    >
                        {pending
                            ? "Creating repository…"
                            : info.status === "pending"
                              ? "Create repository"
                              : "Accept assignment"}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const anyNeedsCustom =
        info.usesCustom &&
        (info.canCreateGroup || info.groups.some((g) => g.needsCustom));

    return (
        <Card className="w-full max-w-xl">
            {header}
            <CardContent>
                <FieldGroup>
                    {anyNeedsCustom && (
                        <>
                            {customField}
                            <p className="-mt-4 text-xs text-muted-foreground">
                                Only needed when you are the first member of a
                                group.
                            </p>
                        </>
                    )}
                    {info.groups.length > 0 && (
                        <ul className="divide-y rounded-lg border">
                            {info.groups.map((group) => (
                                <li
                                    key={group.id}
                                    className="flex items-center gap-3 px-3 py-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm">
                                            {group.name}
                                        </div>
                                        <GroupMembers members={group.members} />
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <UsersIcon className="size-3.5" />
                                        {group.memberCount}
                                        {info.maxGroupMembers !== null &&
                                            ` / ${info.maxGroupMembers}`}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={
                                            group.full || pending !== null
                                        }
                                        onClick={() =>
                                            submit(
                                                group.id,
                                                {
                                                    code,
                                                    action: "join-group",
                                                    groupId: group.id,
                                                    customName: null,
                                                },
                                                group.needsCustom,
                                            )
                                        }
                                    >
                                        {group.full
                                            ? "Full"
                                            : pending === group.id
                                              ? "Joining…"
                                              : "Join"}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {info.groups.length === 0 && !info.canCreateGroup && (
                        <p className="text-sm text-muted-foreground">
                            There are no groups to join yet.
                        </p>
                    )}
                    {info.canCreateGroup && (
                        <>
                            {info.groups.length > 0 && (
                                <FieldSeparator>or</FieldSeparator>
                            )}
                            <Field data-invalid={!!fieldErrors.group}>
                                <FieldLabel htmlFor={`${id}-group`}>
                                    Create a new group
                                </FieldLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id={`${id}-group`}
                                        value={groupName}
                                        onChange={(event) =>
                                            setGroupName(event.target.value)
                                        }
                                        aria-invalid={!!fieldErrors.group}
                                        autoComplete="off"
                                        placeholder="Group name"
                                    />
                                    <Button
                                        disabled={pending !== null}
                                        onClick={() =>
                                            submit(
                                                "create",
                                                {
                                                    code,
                                                    action: "create-group",
                                                    groupName: groupName.trim(),
                                                    customName: null,
                                                },
                                                info.usesCustom,
                                            )
                                        }
                                    >
                                        {pending === "create"
                                            ? "Creating…"
                                            : "Create"}
                                    </Button>
                                </div>
                                {fieldErrors.group && (
                                    <FieldError
                                        errors={[
                                            { message: fieldErrors.group },
                                        ]}
                                    />
                                )}
                            </Field>
                        </>
                    )}
                    {errorAlert}
                </FieldGroup>
            </CardContent>
        </Card>
    );
}

function GroupMembers({
    members,
}: {
    members: JoinInfo["groups"][number]["members"];
}) {
    if (members.length === 0) {
        return (
            <div className="text-xs text-muted-foreground">No members yet</div>
        );
    }
    return (
        <div className="mt-1 flex items-center gap-2">
            <AvatarGroup>
                {members.slice(0, 5).map((member, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: names may repeat
                    <Avatar key={index} className="size-5">
                        {member.image && (
                            <AvatarImage src={member.image} alt="" />
                        )}
                        <AvatarFallback className="text-[0.5rem]">
                            {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </AvatarGroup>
            <span className="min-w-0 truncate text-xs text-muted-foreground">
                {members.map((member) => member.name).join(", ")}
            </span>
        </div>
    );
}
