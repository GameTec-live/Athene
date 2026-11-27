import {
    findNodeAtLocation,
    type ParseError,
    parseTree,
    printParseErrorCode,
} from "jsonc-parser";
import * as v from "valibot";
import { autogradingConfigSchema } from "./schemas";

export type ConfigDiagnostic = {
    message: string;
    offset: number;
    length: number;
};

/** Locate syntax and Valibot errors in the original JSON, including repeated task fields. */
export function getConfigDiagnostics(text: string): ConfigDiagnostic[] {
    const syntaxErrors: ParseError[] = [];
    const root = parseTree(text, syntaxErrors, {
        disallowComments: true,
        allowTrailingComma: false,
    });
    if (syntaxErrors.length) {
        return syntaxErrors.map((error) => ({
            message: printParseErrorCode(error.error).replace(
                /([a-z])([A-Z])/g,
                "$1 $2",
            ),
            offset: Math.min(error.offset, Math.max(0, text.length - 1)),
            length: Math.max(1, error.length),
        }));
    }
    if (!root) return [];
    const result = v.safeParse(autogradingConfigSchema, JSON.parse(text));
    if (result.success) return [];

    return result.issues.map((issue) => {
        const path = (issue.path ?? []).map(
            (item) => item.key as string | number,
        );
        let node = findNodeAtLocation(root, path);
        const missing = !node;
        // A missing field has no value to underline; mark its nearest parent.
        while (!node && path.length) {
            path.pop();
            node = findNodeAtLocation(root, path);
        }
        node ??= root;
        if (
            !missing &&
            issue.path?.at(-1)?.origin === "key" &&
            node.parent?.type === "property"
        ) {
            node = node.parent.children?.[0] ?? node;
        }
        const field = v.getDotPath(issue);
        return {
            message: field ? `${field}: ${issue.message}` : issue.message,
            offset: node.offset,
            length: missing ? 1 : Math.max(1, node.length),
        };
    });
}
