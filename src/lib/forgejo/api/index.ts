import { Api, type ApiConfig } from "./api";

export function forgejoApi<SecurityDataType = unknown>(
    baseUrl: string,
    options?: ApiConfig<SecurityDataType> & { token?: string },
) {
    return new Api({
        ...options,
        baseUrl: `${baseUrl}/api/v1`,
        baseApiParams: {
            format: "json",
            secure: Boolean(options?.token),
        },
        securityWorker: () => {
            if (!options?.token) {
                return;
            }

            return {
                secure: true,
                headers: {
                    Authorization: `Bearer ${options.token}`,
                },
            };
        },
    });
}

export * from "./api";
