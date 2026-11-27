import { PlusIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import {
    type ConfigDraft,
    type GradingTaskDraft,
    newTask,
} from "#/lib/autograding/draft";
import { OverlaySearch } from "./overlay-search";

export function VisualEditor({
    value,
    onChange,
}: {
    value: ConfigDraft;
    onChange: (value: ConfigDraft) => void;
}) {
    const id = useId();

    function addOverlay(url: string) {
        onChange({
            ...value,
            overlays: [...value.overlays, { id: crypto.randomUUID(), url }],
        });
    }
    function updateTask(taskId: string, patch: Partial<GradingTaskDraft>) {
        onChange({
            ...value,
            tasks: value.tasks.map((task) =>
                task.id === taskId ? { ...task, ...patch } : task,
            ),
        });
    }
    function updateCode(
        task: GradingTaskDraft,
        rowId: string,
        patch: Partial<GradingTaskDraft["codes"][number]>,
    ) {
        updateTask(task.id, {
            codes: task.codes.map((row) =>
                row.id === rowId ? { ...row, ...patch } : row,
            ),
        });
    }
    return (
        <div className="space-y-5">
            <div className="max-w-sm space-y-2">
                <Label htmlFor={`${id}-max`}>Maximum points (optional)</Label>
                <Input
                    id={`${id}-max`}
                    inputMode="decimal"
                    placeholder="No maximum"
                    value={value.maxPoints}
                    onChange={(event) =>
                        onChange({ ...value, maxPoints: event.target.value })
                    }
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">Grading tasks</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        onChange({
                            ...value,
                            tasks: [...value.tasks, newTask()],
                        })
                    }
                >
                    <PlusIcon />
                    Add task
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                {value.tasks.map((task, index) => (
                    <Card key={task.id} className="@container">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Task {index + 1}</CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Remove task ${index + 1}`}
                                onClick={() =>
                                    onChange({
                                        ...value,
                                        tasks: value.tasks.filter(
                                            (entry) => entry.id !== task.id,
                                        ),
                                    })
                                }
                            >
                                <Trash2Icon />
                            </Button>
                        </CardHeader>
                        <CardContent className="grid items-start gap-4 @2xl:grid-cols-2">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`${task.id}-name`}>
                                        Name
                                    </Label>
                                    <Input
                                        id={`${task.id}-name`}
                                        value={task.name}
                                        placeholder="Python tests"
                                        onChange={(event) =>
                                            updateTask(task.id, {
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`${task.id}-command`}>
                                        Command
                                    </Label>
                                    <Textarea
                                        id={`${task.id}-command`}
                                        className="font-mono"
                                        value={task.command}
                                        placeholder="python main.py"
                                        onChange={(event) =>
                                            updateTask(task.id, {
                                                command: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <fieldset className="min-w-0 space-y-2">
                                <legend className="mb-2 font-medium">
                                    Exit codes and points
                                </legend>
                                {task.codes.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex items-end gap-2"
                                    >
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <Label htmlFor={`${row.id}-code`}>
                                                Exit code
                                            </Label>
                                            <Input
                                                id={`${row.id}-code`}
                                                inputMode="numeric"
                                                value={row.code}
                                                onChange={(event) =>
                                                    updateCode(task, row.id, {
                                                        code: event.target
                                                            .value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <Label htmlFor={`${row.id}-points`}>
                                                Points
                                            </Label>
                                            <Input
                                                id={`${row.id}-points`}
                                                inputMode="decimal"
                                                value={row.points}
                                                onChange={(event) =>
                                                    updateCode(task, row.id, {
                                                        points: event.target
                                                            .value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Remove exit code ${row.code || "row"} from task ${index + 1}`}
                                            onClick={() =>
                                                updateTask(task.id, {
                                                    codes: task.codes.filter(
                                                        (entry) =>
                                                            entry.id !== row.id,
                                                    ),
                                                })
                                            }
                                        >
                                            <Trash2Icon />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        updateTask(task.id, {
                                            codes: [
                                                ...task.codes,
                                                {
                                                    id: crypto.randomUUID(),
                                                    code: "",
                                                    points: "",
                                                },
                                            ],
                                        })
                                    }
                                >
                                    <PlusIcon />
                                    Add exit code
                                </Button>
                            </fieldset>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="space-y-3 border-t pt-4">
                <h3 className="font-medium">Overlays</h3>
                <OverlaySearch onSelect={addOverlay} />
                {value.overlays.length === 0 && (
                    <p className="text-muted-foreground">No overlays added.</p>
                )}
                <ul className="space-y-2">
                    {value.overlays.map((overlay, index) => (
                        <li
                            key={overlay.id}
                            className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2"
                        >
                            <span className="min-w-0 break-all font-mono text-xs">
                                {overlay.url || "Empty overlay URL"}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Remove overlay ${index + 1}`}
                                onClick={() =>
                                    onChange({
                                        ...value,
                                        overlays: value.overlays.filter(
                                            (entry) => entry.id !== overlay.id,
                                        ),
                                    })
                                }
                            >
                                <Trash2Icon />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
