import { useRouter } from "@tanstack/react-router";
import { useTransition } from "react";
import { toast } from "#/components/ui/toast";

export function useQuotaAction() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    // Forms await execute so TanStack Form owns their submission lifecycle.
    async function execute(title: string, action: () => Promise<void>) {
        try {
            await action();
            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                        "/_authenticated/dashboard/_admin/settings/quotas" ||
                    match.routeId === "/_authenticated/dashboard/organizations",
                sync: true,
            });
        } catch {
            toast.add({
                title,
                description:
                    "Check the name and your Forgejo connection, then try again.",
                type: "error",
            });
        }
    }

    function run(title: string, action: () => Promise<void>) {
        startTransition(() => execute(title, action));
    }

    return { pending, run, execute };
}
