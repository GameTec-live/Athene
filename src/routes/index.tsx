import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <p>Loading</p>;
    }

    if (session?.user) {
        return (
            <div>
                <p>{session.user.name}</p>
                <button
                    onClick={() => {
                        void authClient.signOut();
                    }}
                    type="button"
                >
                    Sign out
                </button>
            </div>
        );
    } else {
        return (
            <div>
                <button
                    onClick={() => {
                        void authClient.signIn.social({
                            provider: "forgejo",
                        });
                    }}
                    type="button"
                >
                    Sign in with Forgejo
                </button>
            </div>
        );
    }
}
