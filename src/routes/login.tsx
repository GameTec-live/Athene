import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { authClient } from "#/lib/auth-client";

function getSafeRedirect(value: unknown) {
    return typeof value === "string" &&
        value.startsWith("/") &&
        !value.startsWith("//")
        ? value
        : "/";
}

export const Route = createFileRoute("/login")({
    validateSearch: (search) => {
        const { redirect } = search;
        return {
            redirect: getSafeRedirect(redirect),
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { redirect } = Route.useSearch();

    return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-6">
            <Card className="w-full max-w-xl gap-8 py-10 [--card-spacing:--spacing(6)] sm:gap-10 sm:py-14 sm:[--card-spacing:--spacing(12)]">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-semibold sm:text-4xl">
                        Login in to Athene
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button
                        className="h-14 w-full text-lg"
                        size="lg"
                        onClick={() => {
                            void authClient.signIn.social({
                                provider: "forgejo",
                                callbackURL: redirect,
                            });
                        }}
                        type="button"
                    >
                        Sign in with Forgejo
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
