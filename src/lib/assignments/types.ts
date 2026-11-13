export type ForgejoStudent = {
    forgejoId: number;
    username: string;
    fullName: string;
    email: string | null;
    avatarUrl: string | null;
};

/** Streamed while repositories of a new assignment are being created. */
export type ProvisionEvent =
    | { type: "started"; name: string }
    | {
          type: "finished";
          name: string;
          success: true;
          repositoryName: string;
      }
    | { type: "finished"; name: string; success: false; error: string };
