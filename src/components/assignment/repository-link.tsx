import { ExternalLinkIcon } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "#/components/ui/tooltip";

export type RepositoryState = {
    repositoryName: string | null;
    repositoryUrl: string | null;
    status: "ready" | "pending" | "failed";
    error: string | null;
};

/** A provisioned repository as a Forgejo link, or why there is none yet. */
export function RepositoryLink({
    repository,
    pendingLabel = "Not created yet",
}: {
    repository: RepositoryState;
    pendingLabel?: string;
}) {
    const link = repository.repositoryUrl && repository.repositoryName && (
        <a
            href={repository.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-1 font-mono text-primary underline-offset-4 hover:underline"
        >
            <span className="truncate">{repository.repositoryName}</span>
            <ExternalLinkIcon className="size-3 shrink-0" aria-hidden />
        </a>
    );

    if (repository.status === "failed") {
        return (
            <span className="inline-flex max-w-full items-center gap-2">
                {link}
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Badge
                                variant="destructive"
                                className="cursor-help"
                            />
                        }
                    >
                        Failed
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80 wrap-break-word">
                        {repository.error}
                    </TooltipContent>
                </Tooltip>
            </span>
        );
    }
    return (
        link || <span className="text-muted-foreground">{pendingLabel}</span>
    );
}
