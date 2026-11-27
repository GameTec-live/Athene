import { UploadIcon, XIcon } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog";
import { Field, FieldLabel } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Textarea } from "#/components/ui/textarea";
import { toast } from "#/components/ui/toast";
import {
    MAX_UPLOAD_BYTES,
    parseRosterCsv,
    parseRosterText,
} from "#/lib/roster-csv";
import {
    importRosterEmails,
    type RosterImportSummary,
} from "#/lib/roster-import";
import type { MembershipDialogProps } from "./roster-members";

function importResultToast(rosterName: string, result: RosterImportSummary) {
    return {
        title: result.failed.length
            ? `Import into ${rosterName} completed with errors`
            : result.missing.length
              ? `Some members were not imported into ${rosterName}`
              : `Import into ${rosterName} complete`,
        description: `${result.added} added, ${result.skipped} already members, ${result.missing.length} not found, ${result.failed.length} failed.`,
        type: result.failed.length
            ? "error"
            : result.missing.length
              ? "warning"
              : "success",
    };
}

class IncompleteImportError extends Error {
    constructor(readonly result: RosterImportSummary) {
        super("Some members could not be imported.");
    }
}

export function UploadRosterCsvDialog({
    rosterName,
    busy,
    begin,
    end,
    refresh,
    add,
}: MembershipDialogProps & { rosterName: string }) {
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileEmails, setFileEmails] = useState<string[]>([]);
    const [pastedText, setPastedText] = useState("");
    const [reading, setReading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [error, setError] = useState("");
    const [summary, setSummary] = useState<RosterImportSummary | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLButtonElement>(null);
    const selection = useRef(0);
    const activeImport = useRef<{
        promise: Promise<RosterImportSummary>;
        toastShown: boolean;
    } | null>(null);
    const descriptionId = useId();
    const pastedId = useId();
    const pasted = useMemo(() => {
        try {
            return {
                emails: pastedText.trim() ? parseRosterText(pastedText) : [],
                error: "",
            };
        } catch (cause) {
            return {
                emails: [],
                error:
                    cause instanceof Error
                        ? cause.message
                        : "Could not read the email list.",
            };
        }
    }, [pastedText]);
    const emails = [...new Set([...fileEmails, ...pasted.emails])];

    function clearFile() {
        selection.current++;
        setFileEmails([]);
        setFileName("");
        setError("");
        setSummary(null);
        setReading(false);
    }

    async function selectFiles(files: FileList | null) {
        if (busy || processing || !files?.length) return;
        const version = ++selection.current;
        setFileEmails([]);
        setSummary(null);
        setError("");
        setFileName("");
        setReading(false);
        if (files.length !== 1) {
            setError("Choose one CSV or text file at a time.");
            return;
        }
        const file = files[0];
        if (!/\.(csv|txt)$/i.test(file.name)) {
            setError("Choose a CSV (.csv) or text (.txt) file.");
            return;
        }
        if (!file.size) {
            setError("The file is empty.");
            return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            setError("Choose a file smaller than 2 MB.");
            return;
        }
        setReading(true);
        try {
            const source = await file.text();
            if (selection.current !== version) return;
            setFileEmails(
                /\.csv$/i.test(file.name)
                    ? parseRosterCsv(source)
                    : parseRosterText(source),
            );
            setFileName(file.name);
        } catch (cause) {
            if (selection.current === version)
                setError(
                    cause instanceof Error
                        ? cause.message
                        : "Could not read the file.",
                );
        } finally {
            if (selection.current === version) setReading(false);
        }
    }
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                const job = activeImport.current;
                if (!next && job && !job.toastShown) {
                    job.toastShown = true;
                    void toast
                        .promise(
                            job.promise.then((result) => {
                                if (
                                    result.failed.length ||
                                    result.missing.length
                                )
                                    throw new IncompleteImportError(result);
                                return result;
                            }),
                            {
                                loading: `Importing members into ${rosterName}…`,
                                success: (result) =>
                                    importResultToast(rosterName, result),
                                error: (cause: unknown) =>
                                    cause instanceof IncompleteImportError
                                        ? importResultToast(
                                              rosterName,
                                              cause.result,
                                          )
                                        : `Could not import members into ${rosterName}.`,
                            },
                        )
                        .catch(() => {
                            // The promise toast already displays the failure.
                        });
                }
                setOpen(next);
                if (!processing) {
                    clearFile();
                    setPastedText("");
                }
            }}
        >
            <DialogTrigger
                render={<Button variant="outline" />}
                disabled={busy}
            >
                <UploadIcon />
                Upload
            </DialogTrigger>
            <DialogContent
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg"
                initialFocus={dropRef}
            >
                <DialogHeader>
                    <DialogTitle>Upload</DialogTitle>
                    <DialogDescription>
                        Upload a file or paste emails.
                    </DialogDescription>
                </DialogHeader>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,.txt,text/csv,text/plain"
                    aria-label="Choose CSV or text file"
                    className="hidden"
                    disabled={busy || processing}
                    onChange={(event) => {
                        void selectFiles(event.target.files);
                        event.target.value = "";
                    }}
                />
                <button
                    ref={dropRef}
                    type="button"
                    disabled={busy || processing}
                    aria-describedby={descriptionId}
                    className={`flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-muted-foreground outline-offset-4 hover:bg-muted/50 focus-visible:outline-2 disabled:opacity-60 ${dragging ? "border-primary bg-muted" : "border-border"}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        void selectFiles(event.dataTransfer.files);
                    }}
                >
                    <UploadIcon className="size-6" />
                    <span>Drop a file or click to browse</span>
                    <span id={descriptionId}>
                        CSV (<code>email</code> column) or TXT · Max. 2 MB
                    </span>
                </button>
                {(reading || fileName || error) && (
                    <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1 wrap-break-word">
                            {(reading || fileName) && (
                                <div aria-live="polite" role="status">
                                    {reading ? "Reading file…" : fileName}
                                </div>
                            )}
                            {error && (
                                <p role="alert" className="text-destructive">
                                    {error}
                                </p>
                            )}
                        </div>
                        {(fileName || error) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={
                                    fileName
                                        ? "Remove file"
                                        : "Dismiss file error"
                                }
                                title={
                                    fileName
                                        ? "Remove file"
                                        : "Dismiss file error"
                                }
                                disabled={busy || processing}
                                onClick={clearFile}
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                )}
                <Field>
                    <FieldLabel htmlFor={pastedId}>Paste emails</FieldLabel>
                    <Textarea
                        id={pastedId}
                        value={pastedText}
                        disabled={busy || processing}
                        maxLength={MAX_UPLOAD_BYTES}
                        className="max-h-40 min-h-24"
                        placeholder={"alice@example.com\nbob@example.com"}
                        aria-describedby={`${pastedId}-help${pasted.error ? ` ${pastedId}-error` : ""}`}
                        aria-invalid={Boolean(pasted.error)}
                        onChange={(event) => {
                            setPastedText(event.target.value);
                            setSummary(null);
                        }}
                    />
                    <p
                        id={`${pastedId}-help`}
                        className="text-muted-foreground"
                    >
                        Separate with line breaks, commas, semicolons or spaces.
                    </p>
                    {pasted.error && (
                        <p
                            id={`${pastedId}-error`}
                            role="alert"
                            className="text-destructive"
                        >
                            {pasted.error}
                        </p>
                    )}
                </Field>
                {!reading &&
                    !processing &&
                    !error &&
                    !pasted.error &&
                    !summary &&
                    emails.length > 0 && (
                        <p role="status">
                            {emails.length}{" "}
                            {emails.length === 1 ? "email" : "emails"} ready to
                            import.
                        </p>
                    )}
                {processing && (
                    <div role="status" className="space-y-2">
                        <p>
                            Importing members into {rosterName}: {processed} of{" "}
                            {emails.length} email addresses…
                        </p>
                        <Progress
                            aria-label="Import progress"
                            className="w-full"
                            value={processed}
                            max={emails.length}
                        />
                    </div>
                )}
                {summary && (
                    <div role="status" className="space-y-2">
                        <p>
                            {summary.added} added, {summary.skipped} already
                            members, {summary.missing.length} not found,{" "}
                            {summary.failed.length} failed.
                        </p>
                        {summary.missing.length > 0 && (
                            <p>Some users were not added.</p>
                        )}
                        {summary.failed.length > 0 && (
                            <p className="text-destructive">
                                Some requests failed. Successful additions were
                                saved. Choose the file again or edit the pasted
                                list to retry; existing members will be skipped.
                            </p>
                        )}
                        {(summary.failed.length > 0 ||
                            summary.missing.length > 0) && (
                            <details>
                                <summary className="cursor-pointer">
                                    View skipped and failed addresses
                                </summary>
                                <ul className="mt-2 max-h-32 overflow-auto wrap-break-word">
                                    {summary.missing.map((email) => (
                                        <li key={email}>
                                            {email} — user not found
                                        </li>
                                    ))}
                                    {summary.failed.map((email) => (
                                        <li key={email}>
                                            {email} — request failed
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        )}
                    </div>
                )}
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Close
                    </DialogClose>
                    <Button
                        disabled={
                            busy ||
                            processing ||
                            reading ||
                            Boolean(error || pasted.error) ||
                            !emails.length ||
                            Boolean(summary)
                        }
                        onClick={async () => {
                            if (
                                reading ||
                                error ||
                                pasted.error ||
                                !emails.length ||
                                !begin()
                            )
                                return;
                            setProcessing(true);
                            setProcessed(0);
                            setError("");
                            const job = {
                                promise: importRosterEmails(
                                    emails,
                                    add,
                                    setProcessed,
                                ),
                                toastShown: false,
                            };
                            activeImport.current = job;
                            try {
                                const result = await job.promise;
                                activeImport.current = null;
                                setSummary(result);
                                if (!job.toastShown)
                                    toast.add(
                                        importResultToast(rosterName, result),
                                    );
                                await refresh();
                            } catch {
                                setError(
                                    `Could not import members into ${rosterName}.`,
                                );
                                if (!job.toastShown)
                                    toast.add({
                                        title: `Could not import members into ${rosterName}.`,
                                        type: "error",
                                    });
                            } finally {
                                activeImport.current = null;
                                setProcessing(false);
                                end();
                            }
                        }}
                    >
                        {processing ? "Importing…" : "Import members"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
