import {
    BookIcon,
    CheckIcon,
    CircleDotIcon,
    GitPullRequestIcon,
    PackageIcon,
    RocketIcon,
    SquareKanbanIcon,
} from "lucide-react";
import type { Assignment } from "#/lib/classes.functions";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AssignmentCapabilityChip({
    assignment,
}: {
    assignment: Assignment;
}) {
    if (
        assignment.afHasIssues &&
        assignment.afHasPackages &&
        assignment.afHasProjects &&
        assignment.afHasPullRequests &&
        assignment.afHasReleases &&
        assignment.afHasWiki
    ) {
        return (
            <Badge>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <CheckIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has all features enabled
                        </TooltipContent>
                    </Tooltip>
                </div>
            </Badge>
        );
    }

    if (
        !assignment.afHasIssues &&
        !assignment.afHasPackages &&
        !assignment.afHasProjects &&
        !assignment.afHasPullRequests &&
        !assignment.afHasReleases &&
        !assignment.afHasWiki
    ) {
        return null;
    }

    return (
        <Badge>
            <div className="flex items-center gap-1">
                {assignment.afHasIssues && (
                    <Tooltip>
                        <TooltipTrigger>
                            <CircleDotIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has issues enabled
                        </TooltipContent>
                    </Tooltip>
                )}
                {assignment.afHasPackages && (
                    <Tooltip>
                        <TooltipTrigger>
                            <PackageIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has packages enabled
                        </TooltipContent>
                    </Tooltip>
                )}
                {assignment.afHasProjects && (
                    <Tooltip>
                        <TooltipTrigger>
                            <SquareKanbanIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has projects enabled
                        </TooltipContent>
                    </Tooltip>
                )}
                {assignment.afHasPullRequests && (
                    <Tooltip>
                        <TooltipTrigger>
                            <GitPullRequestIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has pull requests enabled
                        </TooltipContent>
                    </Tooltip>
                )}
                {assignment.afHasReleases && (
                    <Tooltip>
                        <TooltipTrigger>
                            <RocketIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has releases enabled
                        </TooltipContent>
                    </Tooltip>
                )}
                {assignment.afHasWiki && (
                    <Tooltip>
                        <TooltipTrigger>
                            <BookIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Assignment has wiki enabled
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </Badge>
    );
}
