import { useRef } from "react";
import { Badge } from "#/components/ui/badge";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "#/components/ui/tooltip";
import {
    type AssignmentType,
    availablePlaceholders,
    renderRepoName,
    usesCustomPlaceholder,
} from "#/lib/assignments/naming";

export function NamingTemplateField({
    id,
    value,
    onChange,
    onBlur,
    errors,
    type,
    joinLink,
    preview,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    errors?: ({ message?: string } | undefined)[];
    type: AssignmentType;
    joinLink: boolean;
    preview: {
        assignmentName: string;
        className: string;
        orgName: string;
    };
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const placeholders = availablePlaceholders(type, joinLink);
    const example = renderRepoName(value, {
        ...preview,
        assignmentName: preview.assignmentName || "assignment",
        studentName: "jdoe",
        groupName: "Team 1",
        custom: "my-name",
    });

    function insert(token: string) {
        const input = inputRef.current;
        const start = input?.selectionStart ?? value.length;
        const end = input?.selectionEnd ?? value.length;
        const text = `$${token}`;
        onChange(value.slice(0, start) + text + value.slice(end));
        requestAnimationFrame(() => {
            input?.focus();
            input?.setSelectionRange(start + text.length, start + text.length);
        });
    }

    const invalid = !!errors?.length;
    return (
        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={id}>Repository name template</FieldLabel>
            <Input
                ref={inputRef}
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onBlur={onBlur}
                aria-invalid={invalid}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
            />
            <div className="flex flex-wrap gap-1">
                {placeholders.map((placeholder) => (
                    <Tooltip key={placeholder.token}>
                        <TooltipTrigger
                            render={
                                <Badge
                                    render={<button type="button" />}
                                    variant="outline"
                                    className="cursor-pointer font-mono"
                                    onClick={() => insert(placeholder.token)}
                                />
                            }
                        >
                            ${placeholder.token}
                        </TooltipTrigger>
                        <TooltipContent>
                            {placeholder.description}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            {invalid ? (
                <FieldError errors={errors} />
            ) : (
                <FieldDescription>
                    Example: <span className="font-mono">{example || "—"}</span>
                    {usesCustomPlaceholder(value) &&
                        ". $CUSTOM is entered on the join page, so repositories are created when students join."}
                </FieldDescription>
            )}
        </Field>
    );
}
