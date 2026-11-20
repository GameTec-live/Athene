import { createFileRoute } from "@tanstack/react-router";
import { JoinAccountBar } from "#/components/assignment/join-account-bar";
import { JoinAssignment } from "#/components/assignment/join-assignment";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { getJoinInfo, getJoinViewer } from "#/lib/assignments/join.functions";

export const Route = createFileRoute("/_authenticated/join/$code")({
    // Loaded in beforeLoad so the not-found page can show the account too.
    beforeLoad: async () => ({ viewer: await getJoinViewer() }),
    loader: ({ params }) => getJoinInfo({ data: { code: params.code } }),
    component: JoinContent,
    notFoundComponent: JoinNotFound,
});

function JoinContent() {
    const { code } = Route.useParams();
    const info = Route.useLoaderData();
    return (
        <JoinLayout>
            <JoinAssignment code={code} info={info} />
        </JoinLayout>
    );
}

function JoinNotFound() {
    return (
        <JoinLayout>
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Invalid join link</CardTitle>
                    <CardDescription>
                        This link does not belong to an assignment. Ask your
                        teacher for a new one.
                    </CardDescription>
                </CardHeader>
            </Card>
        </JoinLayout>
    );
}

function JoinLayout({ children }: { children: React.ReactNode }) {
    const { viewer } = Route.useRouteContext();
    const { code } = Route.useParams();
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6">
            {children}
            <JoinAccountBar
                viewer={viewer}
                returnTo={`/join/${encodeURIComponent(code)}`}
            />
        </div>
    );
}
