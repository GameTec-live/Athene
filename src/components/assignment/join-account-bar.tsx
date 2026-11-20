import { useRouter } from "@tanstack/react-router";
import { ExternalLinkIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { toast } from "#/components/ui/toast";
import type { getJoinViewer } from "#/lib/assignments/join.functions";
import { authClient } from "#/lib/auth-client";

type Viewer = Awaited<ReturnType<typeof getJoinViewer>>;

/** Shows the signed-in account on the join page and lets students switch. */
export function JoinAccountBar({
    viewer,
    returnTo,
}: {
    viewer: Viewer;
    returnTo: string;
}) {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);
    const initials = (viewer.username ?? viewer.name)
        .split(/[\s._-]+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    async function signOut() {
        setSigningOut(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.navigate({
                        to: "/login",
                        search: { redirect: returnTo },
                    });
                },
                onError: () => {
                    setSigningOut(false);
                    toast.add({ title: "Error signing out", type: "error" });
                },
            },
        });
    }

    return (
        <div className="w-full max-w-xl space-y-2 rounded-lg border bg-card px-4 py-3 text-card-foreground">
            <div className="flex items-center gap-3">
                <Avatar className="size-8">
                    {viewer.image && <AvatarImage src={viewer.image} alt="" />}
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-sm leading-tight">
                    <div className="truncate">
                        <span className="text-muted-foreground">
                            Signed in as{" "}
                        </span>
                        <span className="font-medium">
                            {viewer.username
                                ? `@${viewer.username}`
                                : viewer.name}
                        </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                        {viewer.username && viewer.name !== viewer.username
                            ? `${viewer.name} · ${viewer.email}`
                            : viewer.email}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={signingOut}
                    onClick={signOut}
                >
                    <LogOutIcon data-icon="inline-start" />
                    {signingOut ? "Signing out…" : "Sign out"}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Wrong account? Signing in again reuses your Forgejo session, so
                also{" "}
                <a
                    href={viewer.forgejoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-foreground"
                >
                    sign out of Forgejo
                    <ExternalLinkIcon className="size-3" aria-hidden="true" />
                </a>{" "}
                before signing in with a different one.
            </p>
        </div>
    );
}
