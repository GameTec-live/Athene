import { useForm } from "@tanstack/react-form";
import { CatchBoundary, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { UnlinkIcon } from "lucide-react";
import { Suspense, use, useId, useState, useTransition } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import { quotaNameSchema } from "#/lib/forgejo/quota-schemas";
import {
    type getQuotaMembers,
    updateQuotaMembership,
} from "#/lib/forgejo/quotas";

export function QuotaMembers({
    group,
    members,
}: {
    group: string;
    members: ReturnType<typeof getQuotaMembers>;
}) {
    return (
        <CatchBoundary
            key={group}
            getResetKey={() => members}
            errorComponent={QuotaMembersError}
        >
            <Suspense
                fallback={
                    <p role="status" className="text-xs text-muted-foreground">
                        Loading members…
                    </p>
                }
            >
                <QuotaMembersContent group={group} members={members} />
            </Suspense>
        </CatchBoundary>
    );
}

function QuotaMembersError() {
    const router = useRouter();
    return (
        <div
            role="alert"
            className="flex items-center gap-3 text-xs text-destructive"
        >
            Unable to load memberships.
            <Button
                variant="outline"
                onClick={() =>
                    router.invalidate({
                        filter: (match) =>
                            match.routeId ===
                            "/_authenticated/dashboard/_admin/settings/quotas",
                        sync: true,
                    })
                }
            >
                Retry
            </Button>
        </div>
    );
}

function QuotaMembersContent({
    group,
    members,
}: {
    group: string;
    members: ReturnType<typeof getQuotaMembers>;
}) {
    const data = use(members);
    const router = useRouter();
    const updateMembership = useServerFn(updateQuotaMembership);
    const id = useId();
    const [search, setSearch] = useState("");
    const [pending, startTransition] = useTransition();
    const form = useForm({
        defaultValues: { username: "" },
        onSubmit: async ({ value, formApi }) => {
            if (await update(value.username, "add")) formApi.reset();
        },
    });

    async function update(username: string, action: "add" | "remove") {
        try {
            await updateMembership({ data: { group, username, action } });
            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                    "/_authenticated/dashboard/_admin/settings/quotas",
                sync: true,
            });
            return true;
        } catch {
            toast.add({
                title: "Failed to update membership",
                description: "Check the Forgejo username or organization slug.",
                type: "error",
            });
            return false;
        }
    }

    const filtered = data.filter((member) =>
        `${member.login} ${member.fullName ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <section
                    className="space-y-3"
                    aria-labelledby={`${id}-heading`}
                >
                    <h3 id={`${id}-heading`} className="text-sm font-medium">
                        Memberships
                    </h3>
                    <form
                        className="flex items-start gap-2"
                        noValidate
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <form.Field
                            name="username"
                            validators={{ onSubmit: quotaNameSchema }}
                        >
                            {(field) => (
                                <Field data-invalid={!field.state.meta.isValid}>
                                    <FieldLabel htmlFor={`${id}-member`}>
                                        Username or organization slug
                                    </FieldLabel>
                                    <Input
                                        id={`${id}-member`}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                        onBlur={field.handleBlur}
                                        aria-invalid={!field.state.meta.isValid}
                                        placeholder="e.g. alice or computer-science"
                                        autoComplete="off"
                                        disabled={isSubmitting || pending}
                                    />
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                </Field>
                            )}
                        </form.Field>
                        <Button
                            type="submit"
                            className="mt-6"
                            disabled={isSubmitting || pending}
                        >
                            {isSubmitting ? "Adding…" : "Add member"}
                        </Button>
                    </form>
                    {data.length > 0 && (
                        <Input
                            aria-label="Search memberships"
                            placeholder="Search memberships…"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    )}
                    <ul className="divide-y rounded-md border">
                        {filtered.map((member) => (
                            <li
                                key={member.login}
                                className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                            >
                                <span className="min-w-0 wrap-break-word">
                                    <span className="font-medium">
                                        {member.login}
                                    </span>
                                    {member.fullName && (
                                        <span className="ml-2 text-muted-foreground">
                                            {member.fullName}
                                        </span>
                                    )}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isSubmitting || pending}
                                    aria-label={`Remove ${member.login} from ${group}`}
                                    title="Remove member from this group"
                                    onClick={() =>
                                        startTransition(async () => {
                                            await update(
                                                member.login,
                                                "remove",
                                            );
                                        })
                                    }
                                >
                                    <UnlinkIcon />
                                </Button>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="p-3 text-xs text-muted-foreground">
                                {data.length
                                    ? "No matching memberships."
                                    : "No members in this group."}
                            </li>
                        )}
                    </ul>
                </section>
            )}
        </form.Subscribe>
    );
}
