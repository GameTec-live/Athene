import { Trash2Icon } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { useQuotaAction } from "./use-quota-action";

export function QuotaDeleteButton({
    name,
    kind,
    description,
    disabled = false,
    onDelete,
}: {
    name: string;
    kind: "group" | "rule";
    description: ReactNode;
    disabled?: boolean;
    onDelete: () => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const { pending, run } = useQuotaAction();

    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                if (!pending) setOpen(open);
            }}
        >
            <AlertDialogTrigger
                render={<Button variant="ghost" size="icon" />}
                disabled={disabled || pending}
                aria-label={`Delete ${name}`}
                title={
                    kind === "rule"
                        ? "Delete rule from all groups"
                        : "Delete group"
                }
            >
                <Trash2Icon />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={pending}
                        onClick={() =>
                            run(`Failed to delete quota ${kind}`, async () => {
                                await onDelete();
                                setOpen(false);
                            })
                        }
                    >
                        {pending ? "Deleting…" : `Delete ${kind}`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
