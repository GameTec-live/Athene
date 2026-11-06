import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { env } from "#/env";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
            <div className="w-full max-w-3xl space-y-10">
                <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">
                    Welcome to Athene
                </h1>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="gap-3">
                            <CardTitle className="text-2xl">
                                I'm a teacher
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Manage your organizations, classes, and
                                assignments in Athene.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button
                                nativeButton={false}
                                className="w-full"
                                render={
                                    <Link
                                        to="/login"
                                        search={{ redirect: "/dashboard" }}
                                    />
                                }
                            >
                                Sign in to Athene
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="gap-3">
                            <CardTitle className="text-2xl">
                                I'm a student
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Open Forgejo to access your repositories and
                                work on assignments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button
                                nativeButton={false}
                                variant="outline"
                                className="w-full"
                                render={<a href={env.VITE_FORGEJO_BASE_URL} />}
                            >
                                Continue to Forgejo
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
