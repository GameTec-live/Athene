import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    const { data: session } = authClient.useSession();

    return (
        <div>
            <p>welcome!</p>
            {session?.user && <p>{session.user.name}</p>}
        </div>
    );
}
