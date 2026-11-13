import {
    CheckIcon,
    CircleCheckIcon,
    CircleIcon,
    CircleXIcon,
    CopyIcon,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "#/components/ui/input-group";
import { Spinner } from "#/components/ui/spinner";

export type CreationItem = {
    name: string;
    status: "pending" | "running" | "done" | "failed";
    detail?: string;
};

export type CreationState = {
    phase: "saving" | "provisioning" | "done";
    assignmentId?: string;
    joinUrl?: string | null;
    items: CreationItem[];
    /** Progress updates stopped before all repositories reported back. */
    connectionLost?: boolean;
};

/** Follows an assignment from saving through repository creation. */
export function CreationProgressDialog({
    state,
    onContinue,
}: {
    state: CreationState;
    onContinue: () => void;
}) {
    const done = state.phase === "done";
    const finished = state.items.filter(
        (item) => item.status === "done" || item.status === "failed",
    ).length;
    const failed = state.items.filter((item) => item.status === "failed");
    const total = state.items.length;

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                // Stay open while work is in progress so it is not abandoned.
                if (!open && done) onContinue();
            }}
            disablePointerDismissal
        >
            <DialogContent showCloseButton={done}>
                <DialogHeader>
                    <DialogTitle>
                        {done ? "Assignment created" : "Creating assignment"}
                    </DialogTitle>
                    <DialogDescription>
                        {state.phase === "saving"
                            ? "Saving the assignment…"
                            : state.phase === "provisioning"
                              ? `Creating repositories: ${finished} of ${total}`
                              : total > 0
                                ? `${total - failed.length} of ${total} repositories created.`
                                : "The assignment has been saved."}
                    </DialogDescription>
                </DialogHeader>

                {state.phase === "saving" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner />
                        Saving assignment and registering students…
                    </div>
                )}

                {total > 0 && (
                    <div className="space-y-2">
                        <div
                            className="h-1.5 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={total}
                            aria-valuenow={finished}
                            aria-label="Repositories created"
                        >
                            <div
                                className="h-full rounded-full bg-primary transition-[width] duration-300"
                                style={{
                                    width: `${(finished / total) * 100}%`,
                                }}
                            />
                        </div>
                        <ul className="max-h-64 divide-y overflow-y-auto rounded-lg border">
                            {state.items.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex items-start gap-2 px-3 py-2 text-xs"
                                >
                                    <ItemIcon status={item.status} />
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate">
                                            {item.name}
                                        </div>
                                        {item.detail && (
                                            <div
                                                className={
                                                    item.status === "failed"
                                                        ? "wrap-break-word text-destructive"
                                                        : "truncate font-mono text-muted-foreground"
                                                }
                                            >
                                                {item.detail}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {done && state.connectionLost && (
                    <Alert>
                        <AlertDescription>
                            Progress updates were interrupted. The remaining
                            repositories are still being created in the
                            background.
                        </AlertDescription>
                    </Alert>
                )}
                {done && failed.length > 0 && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {failed.length}{" "}
                            {failed.length === 1
                                ? "repository"
                                : "repositories"}{" "}
                            could not be created. The errors are saved with the
                            assignment.
                        </AlertDescription>
                    </Alert>
                )}
                {done && state.joinUrl && <JoinLink url={state.joinUrl} />}

                <DialogFooter>
                    <Button type="button" disabled={!done} onClick={onContinue}>
                        {done ? "Go to assignment" : "Please wait…"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ItemIcon({ status }: { status: CreationItem["status"] }) {
    switch (status) {
        case "running":
            return <Spinner className="mt-px size-3.5 shrink-0" />;
        case "done":
            return (
                <CircleCheckIcon
                    className="mt-px size-3.5 shrink-0 text-primary"
                    aria-label="Created"
                />
            );
        case "failed":
            return (
                <CircleXIcon
                    className="mt-px size-3.5 shrink-0 text-destructive"
                    aria-label="Failed"
                />
            );
        default:
            return (
                <CircleIcon
                    className="mt-px size-3.5 shrink-0 text-muted-foreground"
                    aria-label="Waiting"
                />
            );
    }
}

function JoinLink({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
                Share this link with your students so they can join.
            </p>
            <InputGroup>
                <InputGroupInput
                    readOnly
                    value={url}
                    aria-label="Join link"
                    onFocus={(event) => event.target.select()}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="icon-xs"
                        aria-label="Copy join link"
                        onClick={async () => {
                            await navigator.clipboard.writeText(url);
                            setCopied(true);
                        }}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
