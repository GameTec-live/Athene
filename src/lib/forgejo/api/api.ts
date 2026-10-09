/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** APIError is an api error with a message */
export interface APIError {
  message?: string;
  url?: string;
}

export interface APIForbiddenError {
  message?: string;
  url?: string;
}

export interface APIInternalServerError {
  message?: string;
  url?: string;
}

export interface APIInvalidTopicsError {
  invalidTopics?: string[];
  message?: string;
}

export interface APINotFound {
  errors?: string[];
  message?: string;
  url?: string;
}

export interface APIRepoArchivedError {
  message?: string;
  url?: string;
}

export interface APIUnauthorizedError {
  message?: string;
  url?: string;
}

export interface APIValidationError {
  message?: string;
  url?: string;
}

export interface APRemoteFollowOption {
  target?: string;
}

/** AccessToken represents an API access token. */
export interface AccessToken {
  /** @format date-time */
  created_at?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  /**
   * Indicates that an access token only has access to the specified repositories.  Will be null if the access token
   * is not limited to a set of specified repositories.
   */
  repositories?: RepositoryMeta[];
  scopes?: string[];
  sha1?: string;
  token_last_eight?: string;
}

/** ActionArtifact represents an artifact of a workflow run */
export interface ActionArtifact {
  /** the URL to download the artifact zip archive */
  archive_download_url?: string;
  /** @format date-time */
  created_at?: string;
  /** whether the artifact has expired */
  expired?: boolean;
  /** @format date-time */
  expires_at?: string;
  /**
   * the artifact's ID
   * @format int64
   */
  id?: number;
  /** the artifact's name */
  name?: string;
  /**
   * the ID of the workflow run that produced this artifact
   * @format int64
   */
  run_id?: number;
  /**
   * the total size of the artifact in bytes
   * @format int64
   */
  size_in_bytes?: number;
  /** @format date-time */
  updated_at?: string;
}

/** ActionRun represents an action run */
export interface ActionRun {
  /**
   * the cron id for the schedule trigger
   * @format int64
   */
  ScheduleID?: number;
  /**
   * who approved this action run
   * @format int64
   */
  approved_by?: number;
  /** the commit sha the action run ran on */
  commit_sha?: string;
  /**
   * when the action run was created
   * @format date-time
   */
  created?: string;
  /**
   * A Duration represents the elapsed time between two instants
   * as an int64 nanosecond count. The representation limits the
   * largest representable duration to approximately 290 years.
   */
  duration?: Duration;
  /** the webhook event that causes the workflow to run */
  event?: string;
  /** the payload of the webhook event that causes the workflow to run */
  event_payload?: string;
  /** the url of this action run */
  html_url?: string;
  /**
   * the action run id
   * @format int64
   */
  id?: number;
  /**
   * a unique number for each run of a repository
   * @format int64
   */
  index_in_repo?: number;
  /** If this is triggered by a PR from a forked repository or an untrusted user, we need to check if it is approved and limit permissions when running the workflow. */
  is_fork_pull_request?: boolean;
  /** has the commit/tag/… the action run ran on been deleted */
  is_ref_deleted?: boolean;
  /** may need approval if it's a fork pull request */
  need_approval?: boolean;
  /** the commit/tag/… the action run ran on */
  prettyref?: string;
  /** Repository represents a repository */
  repository?: Repository;
  /**
   * when the action run was started
   * @format date-time
   */
  started?: string;
  /** the current status of this run */
  status?: string;
  /**
   * when the action run was stopped
   * @format date-time
   */
  stopped?: string;
  /** the action run's title */
  title?: string;
  /** the trigger event defined in the `on` configuration of the triggered workflow */
  trigger_event?: string;
  /** User represents a user */
  trigger_user?: User;
  /**
   * when the action run was last updated
   * @format date-time
   */
  updated?: string;
  /** the name of workflow file */
  workflow_id?: string;
}

/** ActionRunJob represents a job of a run */
export interface ActionRunJob {
  /**
   * How many times the job has been attempted including the current attempt.
   * @format int64
   */
  attempt?: number;
  /** Opaque identifier that uniquely identifies a single attempt of a job. */
  handle?: string;
  /**
   * Identifier of this job.
   * @format int64
   */
  id?: number;
  /** the action run job name */
  name?: string;
  /** the action run job needed ids */
  needs?: string[];
  /**
   * the owner id
   * @format int64
   */
  owner_id?: number;
  /**
   * the repository id
   * @format int64
   */
  repo_id?: number;
  /**
   * Identifier of the workflow run this job belongs to.
   * @format int64
   */
  run_id?: number;
  /** the action run job labels to run on */
  runs_on?: string[];
  /** the action run job status */
  status?: string;
  /**
   * the action run job latest task id
   * @format int64
   */
  task_id?: number;
}

/** ActionRunner represents a runner */
export interface ActionRunner {
  /** Description provides optional details about this runner. */
  description?: string;
  /** Indicates if runner is ephemeral runner */
  ephemeral?: boolean;
  /**
   * ID uniquely identifies this runner.
   * @format int64
   */
  id?: number;
  /** Labels is a list of labels attached to this runner. */
  labels?: string[];
  /** Name of the runner; not unique. */
  name?: string;
  /**
   * OwnerID is the identifier of the user or organization this runner belongs to. O if the runner is owned by a
   * repository.
   * @format int64
   */
  owner_id?: number;
  /**
   * RepoID is the identifier of the repository this runner belongs to. 0 if the runner belongs to a user or
   * organization.
   * @format int64
   */
  repo_id?: number;
  /** Status indicates whether this runner is offline, or active, for example. */
  status?: 'offline' | 'idle' | 'active';
  /** UUID uniquely identifies this runner. */
  uuid?: string;
  /** Version is the self-reported version string of Forgejo Runner. */
  version?: string;
}

/** ActionTask represents a ActionTask */
export interface ActionTask {
  /** @format date-time */
  created_at?: string;
  display_title?: string;
  event?: string;
  head_branch?: string;
  head_sha?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  /** @format int64 */
  run_number?: number;
  /** @format date-time */
  run_started_at?: string;
  status?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
  workflow_id?: string;
}

/** ActionTaskResponse returns a ActionTask */
export interface ActionTaskResponse {
  /** @format int64 */
  total_count?: number;
  workflow_runs?: ActionTask[];
}

/** ActionVariable return value of the query API */
export interface ActionVariable {
  /** the value of the variable */
  data?: string;
  /** the name of the variable */
  name?: string;
  /**
   * the owner to which the variable belongs
   * @format int64
   */
  owner_id?: number;
  /**
   * the repository to which the variable belongs
   * @format int64
   */
  repo_id?: number;
}

export interface Activity {
  /** User represents a user */
  act_user?: User;
  /** @format int64 */
  act_user_id?: number;
  /** Comment represents a comment on a commit or issue */
  comment?: Comment;
  /** @format int64 */
  comment_id?: number;
  content?: string;
  /** @format date-time */
  created?: string;
  /** @format int64 */
  id?: number;
  is_private?: boolean;
  /** the type of action */
  op_type?:
    | 'create_repo'
    | 'rename_repo'
    | 'star_repo'
    | 'watch_repo'
    | 'commit_repo'
    | 'create_issue'
    | 'create_pull_request'
    | 'transfer_repo'
    | 'push_tag'
    | 'comment_issue'
    | 'merge_pull_request'
    | 'close_issue'
    | 'reopen_issue'
    | 'close_pull_request'
    | 'reopen_pull_request'
    | 'delete_tag'
    | 'delete_branch'
    | 'mirror_sync_push'
    | 'mirror_sync_create'
    | 'mirror_sync_delete'
    | 'approve_pull_request'
    | 'reject_pull_request'
    | 'comment_pull'
    | 'publish_release'
    | 'pull_review_dismissed'
    | 'pull_request_ready_for_review'
    | 'auto_merge_pull_request';
  ref_name?: string;
  /** Repository represents a repository */
  repo?: Repository;
  /** @format int64 */
  repo_id?: number;
  /** @format int64 */
  user_id?: number;
}

/** ActivityPub type */
export interface ActivityPub {
  '@context'?: string;
}

/** AddCollaboratorOption options when adding a user as a collaborator of a repository */
export interface AddCollaboratorOption {
  permission?: 'read' | 'write' | 'admin';
}

/** AddTimeOption options for adding time to an issue */
export interface AddTimeOption {
  /** @format date-time */
  created?: string;
  /**
   * time in seconds
   * @format int64
   */
  time: number;
  /** User who spent the time (optional) */
  user_name?: string;
}

/** AnnotatedTag represents an annotated tag */
export interface AnnotatedTag {
  /** TagArchiveDownloadCount counts how many times a archive was downloaded */
  archive_download_count?: TagArchiveDownloadCount;
  message?: string;
  /** AnnotatedTagObject contains meta information of the tag object */
  object?: AnnotatedTagObject;
  sha?: string;
  tag?: string;
  tagger?: CommitUser;
  url?: string;
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

/** AnnotatedTagObject contains meta information of the tag object */
export interface AnnotatedTagObject {
  sha?: string;
  type?: string;
  url?: string;
}

/** Attachment a generic attachment */
export interface Attachment {
  browser_download_url?: string;
  /** @format date-time */
  created_at?: string;
  /** @format int64 */
  download_count?: number;
  /** @format int64 */
  id?: number;
  name?: string;
  /** @format int64 */
  size?: number;
  type?: 'attachment' | 'external';
  uuid?: string;
}

/** BlockedUser represents a blocked user. */
export interface BlockedUser {
  /** @format int64 */
  block_id?: number;
  /** @format date-time */
  created_at?: string;
}

/** Branch represents a repository branch */
export interface Branch {
  /** PayloadCommit represents a commit */
  commit?: PayloadCommit;
  effective_branch_protection_name?: string;
  enable_status_check?: boolean;
  name?: string;
  protected?: boolean;
  /** @format int64 */
  required_approvals?: number;
  status_check_contexts?: string[];
  user_can_merge?: boolean;
  user_can_push?: boolean;
}

/** BranchProtection represents a branch protection for a repository */
export interface BranchProtection {
  apply_to_admins?: boolean;
  approvals_whitelist_teams?: string[];
  approvals_whitelist_username?: string[];
  block_on_official_review_requests?: boolean;
  block_on_outdated_branch?: boolean;
  block_on_rejected_reviews?: boolean;
  /** Deprecated: true */
  branch_name?: string;
  /** @format date-time */
  created_at?: string;
  dismiss_stale_approvals?: boolean;
  enable_approvals_whitelist?: boolean;
  enable_merge_whitelist?: boolean;
  enable_push?: boolean;
  enable_push_whitelist?: boolean;
  enable_status_check?: boolean;
  ignore_stale_approvals?: boolean;
  merge_whitelist_teams?: string[];
  merge_whitelist_usernames?: string[];
  protected_file_patterns?: string;
  push_whitelist_deploy_keys?: boolean;
  push_whitelist_teams?: string[];
  push_whitelist_usernames?: string[];
  require_signed_commits?: boolean;
  /** @format int64 */
  required_approvals?: number;
  rule_name?: string;
  status_check_contexts?: string[];
  unprotected_file_patterns?: string;
  /** @format date-time */
  updated_at?: string;
}

/** ChangeFileOperation for creating, updating or deleting a file */
export interface ChangeFileOperation {
  /** new or updated file content, must be base64 encoded */
  content?: string;
  /** old path of the file to move */
  from_path?: string;
  /** indicates what to do with the file */
  operation: 'create' | 'update' | 'delete';
  /** path to the existing or new file */
  path: string;
  /** sha is the SHA for the file that already exists, required for update or delete */
  sha?: string;
}

/**
 * ChangeFilesOptions options for creating, updating or deleting multiple files
 * Note: `author` and `committer` are optional (if only one is given, it will be used for the other, otherwise the authenticated user will be used)
 */
export interface ChangeFilesOptions {
  /** Identity for a person's identity like an author or committer */
  author?: Identity;
  /** branch (optional) to base this file from. if not given, the default branch is used */
  branch?: string;
  /** Identity for a person's identity like an author or committer */
  committer?: Identity;
  /** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
  dates?: CommitDateOptions;
  /** list of file operations */
  files: ChangeFileOperation[];
  /** (optional) will do a force-push if the new branch already exists */
  force_overwrite_new_branch?: boolean;
  /** message (optional) for the commit of this file. if not supplied, a default message will be used */
  message?: string;
  /** new_branch (optional) will make a new branch from `branch` before creating the file */
  new_branch?: string;
  /** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
  signoff?: boolean;
}

/** ChangedFile store information about files affected by the pull request */
export interface ChangedFile {
  /** @format int64 */
  additions?: number;
  /** @format int64 */
  changes?: number;
  contents_url?: string;
  /** @format int64 */
  deletions?: number;
  filename?: string;
  html_url?: string;
  previous_filename?: string;
  raw_url?: string;
  status?: string;
}

/** CombinedStatus holds the combined state of several statuses for a single commit */
export interface CombinedStatus {
  commit_url?: string;
  /** Repository represents a repository */
  repository?: Repository;
  sha?: string;
  /**
   * CommitStatusState holds the state of a CommitStatus
   * It can be "pending", "success", "error", "failure", "warning", or "skipped"
   */
  state?: CommitStatusState;
  statuses?: CommitStatus[];
  /** @format int64 */
  total_count?: number;
  url?: string;
}

/** Comment represents a comment on a commit or issue */
export interface Comment {
  /** The attachments to the comment */
  assets?: Attachment[];
  /** The body of the comment */
  body?: string;
  /**
   * The time of the comment's creation
   * @format date-time
   */
  created_at?: string;
  /** The HTML URL of the comment */
  html_url?: string;
  /**
   * The identifier of the comment
   * @format int64
   */
  id?: number;
  /** The HTML URL of the issue if the comment is posted on an issue, else empty string */
  issue_url?: string;
  /** The original author that posted the comment if it was not posted locally, else empty string */
  original_author?: string;
  /**
   * The ID of the original author that posted the comment if it was not posted locally, else 0
   * @format int64
   */
  original_author_id?: number;
  /** The HTML URL of the pull request if the comment is posted on a pull request, else empty string */
  pull_request_url?: string;
  /**
   * The time of the comment's update
   * @format date-time
   */
  updated_at?: string;
  /** User represents a user */
  user?: User;
}

/** Commit contains information generated from a Git commit. */
export interface Commit {
  /** User represents a user */
  author?: User;
  commit?: RepoCommit;
  /** User represents a user */
  committer?: User;
  /** @format date-time */
  created?: string;
  files?: CommitAffectedFiles[];
  html_url?: string;
  parents?: CommitMeta[];
  sha?: string;
  /** CommitStats is statistics for a RepoCommit */
  stats?: CommitStats;
  url?: string;
}

/** CommitAffectedFiles store information about files affected by the commit */
export interface CommitAffectedFiles {
  filename?: string;
  status?: string;
}

/** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
export interface CommitDateOptions {
  /** @format date-time */
  author?: string;
  /** @format date-time */
  committer?: string;
}

/** CommitMeta contains meta information of a commit in terms of API. */
export interface CommitMeta {
  /** @format date-time */
  created?: string;
  sha?: string;
  url?: string;
}

/** CommitStats is statistics for a RepoCommit */
export interface CommitStats {
  /** @format int64 */
  additions?: number;
  /** @format int64 */
  deletions?: number;
  /** @format int64 */
  total?: number;
}

/** CommitStatus holds a single status of a single Commit */
export interface CommitStatus {
  context?: string;
  /** @format date-time */
  created_at?: string;
  /** User represents a user */
  creator?: User;
  description?: string;
  /** @format int64 */
  id?: number;
  /**
   * CommitStatusState holds the state of a CommitStatus
   * It can be "pending", "success", "error", "failure", "warning", or "skipped"
   */
  status?: CommitStatusState;
  target_url?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
}

/**
 * CommitStatusState holds the state of a CommitStatus
 * It can be "pending", "success", "error", "failure", "warning", or "skipped"
 */
export type CommitStatusState = string;

/** CommitUser contains information of a user in the context of a commit. */
export interface CommitUser {
  date?: string;
  /** @format email */
  email?: string;
  name?: string;
}

/** Compare represents a comparison between two commits. */
export interface Compare {
  commits?: Commit[];
  files?: CommitAffectedFiles[];
  /** @format int64 */
  total_commits?: number;
}

/** ContentsResponse contains information about a repo's entry's (dir, file, symlink, submodule) metadata and content */
export interface ContentsResponse {
  /** FileLinksResponse contains the links for a repo's file */
  _links?: FileLinksResponse;
  /** `content` is populated when `type` is `file`, otherwise null */
  content?: string;
  download_url?: string;
  /** `encoding` is populated when `type` is `file`, otherwise null */
  encoding?: string;
  git_url?: string;
  html_url?: string;
  last_commit_sha?: string;
  /** @format date-time */
  last_commit_when?: string;
  name?: string;
  path?: string;
  sha?: string;
  /** @format int64 */
  size?: number;
  /** `submodule_git_url` is populated when `type` is `submodule`, otherwise null */
  submodule_git_url?: string;
  /** `target` is populated when `type` is `symlink`, otherwise null */
  target?: string;
  /** `type` will be `file`, `dir`, `symlink`, or `submodule` */
  type?: string;
  url?: string;
}

/** CreateAccessTokenOption options when create access token */
export interface CreateAccessTokenOption {
  name: string;
  /** If provided and not-empty, creates an access token with access only to specified repositories. */
  repositories?: RepoTargetOption[];
  /** @example ["all","read:activitypub","read:issue","write:misc","read:notification","read:organization","read:package","read:repository","read:user"] */
  scopes?: string[];
}

/** CreateBranchProtectionOption options for creating a branch protection */
export interface CreateBranchProtectionOption {
  apply_to_admins?: boolean;
  approvals_whitelist_teams?: string[];
  approvals_whitelist_username?: string[];
  block_on_official_review_requests?: boolean;
  block_on_outdated_branch?: boolean;
  block_on_rejected_reviews?: boolean;
  /** Deprecated: true */
  branch_name?: string;
  dismiss_stale_approvals?: boolean;
  enable_approvals_whitelist?: boolean;
  enable_merge_whitelist?: boolean;
  enable_push?: boolean;
  enable_push_whitelist?: boolean;
  enable_status_check?: boolean;
  ignore_stale_approvals?: boolean;
  merge_whitelist_teams?: string[];
  merge_whitelist_usernames?: string[];
  protected_file_patterns?: string;
  push_whitelist_deploy_keys?: boolean;
  push_whitelist_teams?: string[];
  push_whitelist_usernames?: string[];
  require_signed_commits?: boolean;
  /** @format int64 */
  required_approvals?: number;
  rule_name?: string;
  status_check_contexts?: string[];
  unprotected_file_patterns?: string;
}

/** CreateBranchRepoOption options when creating a branch in a repository */
export interface CreateBranchRepoOption {
  /**
   * Name of the branch to create
   * @uniqueItems true
   */
  new_branch_name: string;
  /**
   * Deprecated: true
   * Name of the old branch to create from
   * @uniqueItems true
   */
  old_branch_name?: string;
  /**
   * Name of the old branch/tag/commit to create from
   * @uniqueItems true
   */
  old_ref_name?: string;
}

/** CreateEmailOption options when creating email addresses */
export interface CreateEmailOption {
  /** email addresses to add */
  emails?: string[];
}

/**
 * CreateFileOptions options for creating files
 * Note: `author` and `committer` are optional (if only one is given, it will be used for the other, otherwise the authenticated user will be used)
 */
export interface CreateFileOptions {
  /** Identity for a person's identity like an author or committer */
  author?: Identity;
  /** branch (optional) to base this file from. if not given, the default branch is used */
  branch?: string;
  /** Identity for a person's identity like an author or committer */
  committer?: Identity;
  /** content must be base64 encoded */
  content: string;
  /** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
  dates?: CommitDateOptions;
  /** (optional) will do a force-push if the new branch already exists */
  force_overwrite_new_branch?: boolean;
  /** message (optional) for the commit of this file. if not supplied, a default message will be used */
  message?: string;
  /** new_branch (optional) will make a new branch from `branch` before creating the file */
  new_branch?: string;
  /** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
  signoff?: boolean;
}

/** CreateForkOption options for creating a fork */
export interface CreateForkOption {
  /** name of the forked repository */
  name?: string;
  /** organization name, if forking into an organization */
  organization?: string;
}

/** CreateGPGKeyOption options create user GPG key */
export interface CreateGPGKeyOption {
  /**
   * An armored GPG key to add
   * @uniqueItems true
   */
  armored_public_key: string;
  armored_signature?: string;
}

/** CreateHookOption options when create a hook */
export interface CreateHookOption {
  /** @default false */
  active?: boolean;
  authorization_header?: string;
  branch_filter?: string;
  /**
   * CreateHookOptionConfig has all config options in it
   * required are "content_type" and "url" Required
   */
  config: CreateHookOptionConfig;
  events?: string[];
  type:
    | 'forgejo'
    | 'dingtalk'
    | 'discord'
    | 'gitea'
    | 'gogs'
    | 'msteams'
    | 'slack'
    | 'telegram'
    | 'feishu'
    | 'wechatwork'
    | 'packagist';
}

/**
 * CreateHookOptionConfig has all config options in it
 * required are "content_type" and "url" Required
 */
export type CreateHookOptionConfig = Record<string, string>;

/** CreateIssueCommentOption options for creating a comment on an issue */
export interface CreateIssueCommentOption {
  /** The body of the comment */
  body: string;
  /**
   * The time of the comment's update, needs admin or repository owner permission
   * @format date-time
   */
  updated_at?: string;
}

/** CreateIssueOption options to create one issue */
export interface CreateIssueOption {
  /** deprecated */
  assignee?: string;
  assignees?: string[];
  body?: string;
  closed?: boolean;
  /** @format date-time */
  due_date?: string;
  /** list of label ids */
  labels?: number[];
  /**
   * milestone id
   * @format int64
   */
  milestone?: number;
  ref?: string;
  title: string;
}

/** CreateKeyOption options when creating a key */
export interface CreateKeyOption {
  /**
   * An armored SSH key to add
   * @uniqueItems true
   */
  key: string;
  /** Describe if the key has only read access or read/write */
  read_only?: boolean;
  /**
   * Title of the key to add
   * @uniqueItems true
   */
  title: string;
}

/** CreateLabelOption options for creating a label */
export interface CreateLabelOption {
  /** @example "#00aabb" */
  color: string;
  description?: string;
  /** @example false */
  exclusive?: boolean;
  /** @example false */
  is_archived?: boolean;
  name: string;
}

/** CreateMilestoneOption options for creating a milestone */
export interface CreateMilestoneOption {
  description?: string;
  /** @format date-time */
  due_on?: string;
  state?: 'open' | 'closed';
  title?: string;
}

/** CreateOAuth2ApplicationOptions holds options to create an oauth2 application */
export interface CreateOAuth2ApplicationOptions {
  confidential_client?: boolean;
  name?: string;
  redirect_uris?: string[];
}

/** CreateOrUpdateSecretOption defines the properties of the secret to create or update. */
export interface CreateOrUpdateSecretOption {
  /**
   * Data of the secret. Special characters will be retained. Line endings will be normalized to LF to match the
   * behaviour of browsers. Encode the data with Base64 if line endings should be retained.
   */
  data: string;
}

/** CreateOrgOption options for creating an organization */
export interface CreateOrgOption {
  description?: string;
  email?: string;
  full_name?: string;
  location?: string;
  repo_admin_change_team_access?: boolean;
  username: string;
  /** possible values are `public` (default), `limited` or `private` */
  visibility?: 'public' | 'limited' | 'private';
  website?: string;
}

/** CreatePullRequestOption options when creating a pull request */
export interface CreatePullRequestOption {
  assignee?: string;
  assignees?: string[];
  base?: string;
  body?: string;
  /** @format date-time */
  due_date?: string;
  head?: string;
  labels?: number[];
  /** @format int64 */
  milestone?: number;
  title?: string;
}

/** CreatePullReviewComment represent a review comment for creation api */
export interface CreatePullReviewComment {
  body?: string;
  /**
   * number of additional lines after the commented line (0 = single line comment)
   * @format int64
   */
  extra_lines_count?: number;
  /**
   * if comment to new file line or 0
   * @format int64
   */
  new_position?: number;
  /**
   * if comment to old file line or 0
   * @format int64
   */
  old_position?: number;
  /** the tree path */
  path?: string;
}

export type CreatePullReviewCommentOptions = CreatePullReviewComment;

/** CreatePullReviewOptions are options to create a pull review */
export interface CreatePullReviewOptions {
  body?: string;
  comments?: CreatePullReviewComment[];
  commit_id?: string;
  /** ReviewStateType review state type */
  event?: ReviewStateType;
}

/** CreatePushMirrorOption represents need information to create a push mirror of a repository. */
export interface CreatePushMirrorOption {
  branch_filter?: string;
  interval?: string;
  remote_address?: string;
  remote_password?: string;
  remote_username?: string;
  sync_on_commit?: boolean;
  use_ssh?: boolean;
}

/** CreateQutaGroupOptions represents the options for creating a quota group */
export interface CreateQuotaGroupOptions {
  /** Name of the quota group to create */
  name?: string;
  /**
   * Rules to add to the newly created group.
   * If a rule does not exist, it will be created.
   */
  rules?: CreateQuotaRuleOptions[];
}

/** CreateQuotaRuleOptions represents the options for creating a quota rule */
export interface CreateQuotaRuleOptions {
  /**
   * The limit set by the rule
   * @format int64
   */
  limit?: number;
  /** Name of the rule to create */
  name?: string;
  /** The subjects affected by the rule */
  subjects?: string[];
}

/** CreateReleaseOption options when creating a release */
export interface CreateReleaseOption {
  body?: string;
  draft?: boolean;
  hide_archive_links?: boolean;
  name?: string;
  prerelease?: boolean;
  tag_name: string;
  target_commitish?: string;
}

/** CreateRepoOption options when creating repository */
export interface CreateRepoOption {
  /** Whether the repository should be auto-initialized? */
  auto_init?: boolean;
  /** DefaultBranch of the repository (used when initializes and in template) */
  default_branch?: string;
  /** Description of the repository to create */
  description?: string;
  /** Gitignores to use, separated by commas */
  gitignores?: string;
  /** Label-Set to use */
  issue_labels?: string;
  /** License to use */
  license?: string;
  /**
   * Name of the repository to create
   * @uniqueItems true
   */
  name: string;
  /** ObjectFormatName of the underlying git repository */
  object_format_name?: 'sha1' | 'sha256';
  /** Whether the repository is private */
  private?: boolean;
  /** Readme of the repository to create */
  readme?: string;
  /** Whether the repository is template */
  template?: boolean;
  /** TrustModel of the repository */
  trust_model?: 'default' | 'collaborator' | 'committer' | 'collaboratorcommitter';
}

/** CreateStatusOption holds the information needed to create a new CommitStatus for a Commit */
export interface CreateStatusOption {
  context?: string;
  description?: string;
  /**
   * CommitStatusState holds the state of a CommitStatus
   * It can be "pending", "success", "error", "failure", "warning", or "skipped"
   */
  state?: CommitStatusState;
  target_url?: string;
}

/** CreateTagOption options when creating a tag */
export interface CreateTagOption {
  message?: string;
  tag_name: string;
  target?: string;
}

/** CreateTagProtectionOption options for creating a tag protection */
export interface CreateTagProtectionOption {
  name_pattern?: string;
  whitelist_teams?: string[];
  whitelist_usernames?: string[];
}

/** CreateTeamOption options for creating a team */
export interface CreateTeamOption {
  can_create_org_repo?: boolean;
  description?: string;
  includes_all_repositories?: boolean;
  name: string;
  permission?: 'read' | 'write' | 'admin';
  /** @example ["repo.actions","repo.code","repo.issues","repo.ext_issues","repo.wiki","repo.ext_wiki","repo.pulls","repo.releases","repo.projects","repo.ext_wiki"] */
  units?: string[];
  /** @example {"repo.actions":"none","repo.code":"read","repo.ext_issues":"none","repo.ext_wiki":"none","repo.issues":"write","repo.packages":"none","repo.projects":"none","repo.pulls":"owner","repo.releases":"none","repo.wiki":"admin"} */
  units_map?: Record<string, string>;
}

/** CreateUserOption create user options */
export interface CreateUserOption {
  /**
   * For explicitly setting the user creation timestamp. Useful when users are
   * migrated from other systems. When omitted, the user's creation timestamp
   * will be set to "now".
   * @format date-time
   */
  created_at?: string;
  /** @format email */
  email: string;
  full_name?: string;
  login_name?: string;
  must_change_password?: boolean;
  password?: string;
  restricted?: boolean;
  send_notify?: boolean;
  /** @format int64 */
  source_id?: number;
  username: string;
  visibility?: string;
}

/** CreateVariableOption defines the properties of the variable to create. */
export interface CreateVariableOption {
  /**
   * Value of the variable to create. Special characters will be retained. Line endings will be normalized to LF to
   * match the behaviour of browsers. Encode the data with Base64 if line endings should be retained.
   */
  value: string;
}

/** CreateWikiPageOptions form for creating wiki */
export interface CreateWikiPageOptions {
  /** content must be base64 encoded */
  content_base64?: string;
  /** optional commit message summarizing the change */
  message?: string;
  /** page title. leave empty to keep unchanged */
  title?: string;
}

/** Cron represents a Cron task */
export interface Cron {
  /** @format int64 */
  exec_times?: number;
  name?: string;
  /** @format date-time */
  next?: string;
  /** @format date-time */
  prev?: string;
  schedule?: string;
}

/** DeleteEmailOption options when deleting email addresses */
export interface DeleteEmailOption {
  /** email addresses to delete */
  emails?: string[];
}

/**
 * DeleteFileOptions options for deleting files (used for other File structs below)
 * Note: `author` and `committer` are optional (if only one is given, it will be used for the other, otherwise the authenticated user will be used)
 */
export interface DeleteFileOptions {
  /** Identity for a person's identity like an author or committer */
  author?: Identity;
  /** branch (optional) to base this file from. if not given, the default branch is used */
  branch?: string;
  /** Identity for a person's identity like an author or committer */
  committer?: Identity;
  /** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
  dates?: CommitDateOptions;
  /** (optional) will do a force-push if the new branch already exists */
  force_overwrite_new_branch?: boolean;
  /** message (optional) for the commit of this file. if not supplied, a default message will be used */
  message?: string;
  /** new_branch (optional) will make a new branch from `branch` before creating the file */
  new_branch?: string;
  /** sha is the SHA for the file that already exists */
  sha: string;
  /** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
  signoff?: boolean;
}

/** DeleteLabelOption options for deleting a label */
export interface DeleteLabelsOption {
  /** @format date-time */
  updated_at?: string;
}

/** DeployKey a deploy key */
export interface DeployKey {
  /** @format date-time */
  created_at?: string;
  fingerprint?: string;
  /** @format int64 */
  id?: number;
  key?: string;
  /** @format int64 */
  key_id?: number;
  read_only?: boolean;
  /** Repository represents a repository */
  repository?: Repository;
  title?: string;
  url?: string;
}

/** DismissPullReviewOptions are options to dismiss a pull review */
export interface DismissPullReviewOptions {
  message?: string;
  priors?: boolean;
}

/** DispatchWorkflowOption options when dispatching a workflow */
export interface DispatchWorkflowOption {
  /** Input keys and values configured in the workflow file. */
  inputs?: Record<string, string>;
  /** Git reference for the workflow */
  ref: string;
  /**
   * Flag to return the run info
   * @default false
   */
  return_run_info?: boolean;
}

/** DispatchWorkflowRun represents a workflow run */
export interface DispatchWorkflowRun {
  /**
   * the workflow run id
   * @format int64
   */
  id?: number;
  /** the jobs name */
  jobs?: string[];
  /**
   * a unique number for each run of a repository
   * @format int64
   */
  run_number?: number;
}

/**
 * A Duration represents the elapsed time between two instants
 * as an int64 nanosecond count. The representation limits the
 * largest representable duration to approximately 290 years.
 * @format int64
 */
export type Duration = number;

/** EditAttachmentOptions options for editing attachments */
export interface EditAttachmentOptions {
  /** (Can only be set if existing attachment is of external type) */
  browser_download_url?: string;
  name?: string;
}

/** EditBranchProtectionOption options for editing a branch protection */
export interface EditBranchProtectionOption {
  apply_to_admins?: boolean;
  approvals_whitelist_teams?: string[];
  approvals_whitelist_username?: string[];
  block_on_official_review_requests?: boolean;
  block_on_outdated_branch?: boolean;
  block_on_rejected_reviews?: boolean;
  dismiss_stale_approvals?: boolean;
  enable_approvals_whitelist?: boolean;
  enable_merge_whitelist?: boolean;
  enable_push?: boolean;
  enable_push_whitelist?: boolean;
  enable_status_check?: boolean;
  ignore_stale_approvals?: boolean;
  merge_whitelist_teams?: string[];
  merge_whitelist_usernames?: string[];
  protected_file_patterns?: string;
  push_whitelist_deploy_keys?: boolean;
  push_whitelist_teams?: string[];
  push_whitelist_usernames?: string[];
  require_signed_commits?: boolean;
  /** @format int64 */
  required_approvals?: number;
  status_check_contexts?: string[];
  unprotected_file_patterns?: string;
}

/** EditDeadlineOption options for creating a deadline */
export interface EditDeadlineOption {
  /** @format date-time */
  due_date: string;
}

/** EditGitHookOption options when modifying one Git hook */
export interface EditGitHookOption {
  content?: string;
}

/** EditHookOption options when modify one hook */
export interface EditHookOption {
  active?: boolean;
  authorization_header?: string;
  branch_filter?: string;
  config?: Record<string, string>;
  events?: string[];
}

/** EditIssueCommentOption options for editing a comment */
export interface EditIssueCommentOption {
  /** The body of the comment */
  body: string;
  /**
   * The time of the comment's update, needs admin or repository owner permission
   * @format date-time
   */
  updated_at?: string;
}

/** EditIssueOption options for editing an issue */
export interface EditIssueOption {
  /** deprecated */
  assignee?: string;
  assignees?: string[];
  body?: string;
  /** @format date-time */
  due_date?: string;
  /** @format int64 */
  milestone?: number;
  ref?: string;
  state?: string;
  title?: string;
  unset_due_date?: boolean;
  /** @format date-time */
  updated_at?: string;
}

/** EditLabelOption options for editing a label */
export interface EditLabelOption {
  /** @example "#00aabb" */
  color?: string;
  description?: string;
  /** @example false */
  exclusive?: boolean;
  /** @example false */
  is_archived?: boolean;
  name?: string;
}

/** EditMilestoneOption options for editing a milestone */
export interface EditMilestoneOption {
  description?: string;
  /** @format date-time */
  due_on?: string;
  state?: string;
  title?: string;
}

/** EditOrgOption options for editing an organization */
export interface EditOrgOption {
  description?: string;
  email?: string;
  full_name?: string;
  location?: string;
  repo_admin_change_team_access?: boolean;
  /** possible values are `public`, `limited` or `private` */
  visibility?: 'public' | 'limited' | 'private';
  website?: string;
}

/** EditPullRequestOption options when modify pull request */
export interface EditPullRequestOption {
  allow_maintainer_edit?: boolean;
  assignee?: string;
  assignees?: string[];
  base?: string;
  body?: string;
  /** @format date-time */
  due_date?: string;
  labels?: number[];
  /** @format int64 */
  milestone?: number;
  state?: string;
  title?: string;
  unset_due_date?: boolean;
}

/** EditQuotaRuleOptions represents the options for editing a quota rule */
export interface EditQuotaRuleOptions {
  /**
   * The limit set by the rule
   * @format int64
   */
  limit?: number;
  /** The subjects affected by the rule */
  subjects?: string[];
}

/** EditReactionOption contain the reaction type */
export interface EditReactionOption {
  content?: string;
}

/** EditReleaseOption options when editing a release */
export interface EditReleaseOption {
  body?: string;
  draft?: boolean;
  hide_archive_links?: boolean;
  name?: string;
  prerelease?: boolean;
  tag_name?: string;
  target_commitish?: string;
}

/** EditRepoOption options when editing a repository's properties */
export interface EditRepoOption {
  /** either `true` to allow fast-forward-only merging pull requests, or `false` to prevent fast-forward-only merging. */
  allow_fast_forward_only_merge?: boolean;
  /** either `true` to allow mark pr as merged manually, or `false` to prevent it. */
  allow_manual_merge?: boolean;
  /** either `true` to allow merging pull requests with a merge commit, or `false` to prevent merging pull requests with merge commits. */
  allow_merge_commits?: boolean;
  /** either `true` to allow rebase-merging pull requests, or `false` to prevent rebase-merging. */
  allow_rebase?: boolean;
  /** either `true` to allow rebase with explicit merge commits (--no-ff), or `false` to prevent rebase with explicit merge commits. */
  allow_rebase_explicit?: boolean;
  /** either `true` to allow updating pull request branch by rebase, or `false` to prevent it. */
  allow_rebase_update?: boolean;
  /** either `true` to allow squash-merging pull requests, or `false` to prevent squash-merging. */
  allow_squash_merge?: boolean;
  /** set to `true` to archive this repository. */
  archived?: boolean;
  /** either `true` to enable AutodetectManualMerge, or `false` to prevent it. Note: In some special cases, misjudgments can occur. */
  autodetect_manual_merge?: boolean;
  /** set to `true` to allow edits from maintainers by default */
  default_allow_maintainer_edit?: boolean;
  /** sets the default branch for this repository. */
  default_branch?: string;
  /** set to `true` to delete pr branch after merge by default */
  default_delete_branch_after_merge?: boolean;
  /** set to a merge style to be used by this repository: "merge", "rebase", "rebase-merge", "squash", "fast-forward-only", "manually-merged", or "rebase-update-only". */
  default_merge_style?: string;
  /** set to a update style to be used by this repository: "rebase" or "merge" */
  default_update_style?: string;
  /** a short description of the repository. */
  description?: string;
  /** enable prune - remove obsolete remote-tracking references when mirroring */
  enable_prune?: boolean;
  /** ExternalTracker represents settings for external tracker */
  external_tracker?: ExternalTracker;
  /** ExternalWiki represents setting for external wiki */
  external_wiki?: ExternalWiki;
  /** set the globally editable state of the wiki */
  globally_editable_wiki?: boolean;
  /** either `true` to enable actions unit, or `false` to disable them. */
  has_actions?: boolean;
  /** either `true` to enable issues for this repository or `false` to disable them. */
  has_issues?: boolean;
  /** either `true` to enable packages unit, or `false` to disable them. */
  has_packages?: boolean;
  /** either `true` to enable project unit, or `false` to disable them. */
  has_projects?: boolean;
  /** either `true` to allow pull requests, or `false` to prevent pull request. */
  has_pull_requests?: boolean;
  /** either `true` to enable releases unit, or `false` to disable them. */
  has_releases?: boolean;
  /** either `true` to enable the wiki for this repository or `false` to disable it. */
  has_wiki?: boolean;
  /** either `true` to ignore whitespace for conflicts, or `false` to not ignore whitespace. */
  ignore_whitespace_conflicts?: boolean;
  /** InternalTracker represents settings for internal tracker */
  internal_tracker?: InternalTracker;
  /** set to a string like `8h30m0s` to set the mirror interval time */
  mirror_interval?: string;
  /**
   * name of the repository
   * @uniqueItems true
   */
  name?: string;
  /**
   * either `true` to make the repository private or `false` to make it public.
   * Note: you will get a 422 error if the organization restricts changing repository visibility to organization
   * owners and a non-owner tries to change the value of private.
   */
  private?: boolean;
  /** either `true` to make this repository a template or `false` to make it a normal repository */
  template?: boolean;
  /** a URL with more information about the repository. */
  website?: string;
  /** sets the branch used for this repository's wiki. */
  wiki_branch?: string;
}

/** EditTagProtectionOption options for editing a tag protection */
export interface EditTagProtectionOption {
  name_pattern?: string;
  whitelist_teams?: string[];
  whitelist_usernames?: string[];
}

/** EditTeamOption options for editing a team */
export interface EditTeamOption {
  can_create_org_repo?: boolean;
  description?: string;
  includes_all_repositories?: boolean;
  name: string;
  permission?: 'read' | 'write' | 'admin';
  /** @example ["repo.code","repo.issues","repo.ext_issues","repo.wiki","repo.pulls","repo.releases","repo.projects","repo.ext_wiki"] */
  units?: string[];
  /** @example {"repo.actions":"none","repo.code":"read","repo.ext_issues":"none","repo.ext_wiki":"none","repo.issues":"write","repo.packages":"none","repo.projects":"none","repo.pulls":"owner","repo.releases":"none","repo.wiki":"admin"} */
  units_map?: Record<string, string>;
}

/** EditUserOption edit user options */
export interface EditUserOption {
  active?: boolean;
  admin?: boolean;
  allow_create_organization?: boolean;
  allow_git_hook?: boolean;
  allow_import_local?: boolean;
  description?: string;
  /** @format email */
  email?: string;
  full_name?: string;
  hide_email?: boolean;
  location?: string;
  login_name?: string;
  /** @format int64 */
  max_repo_creation?: number;
  must_change_password?: boolean;
  password?: string;
  prohibit_login?: boolean;
  pronouns?: string;
  restricted?: boolean;
  /** @format int64 */
  source_id?: number;
  visibility?: string;
  website?: string;
}

/** Email an email address belonging to a user */
export interface Email {
  /** @format email */
  email?: string;
  primary?: boolean;
  /** @format int64 */
  user_id?: number;
  username?: string;
  verified?: boolean;
}

/** ExternalTracker represents settings for external tracker */
export interface ExternalTracker {
  /** External Issue Tracker URL Format. Use the placeholders {user}, {repo} and {index} for the username, repository name and issue index. */
  external_tracker_format?: string;
  /** External Issue Tracker issue regular expression */
  external_tracker_regexp_pattern?: string;
  /** External Issue Tracker Number Format, either `numeric`, `alphanumeric`, or `regexp` */
  external_tracker_style?: string;
  /** URL of external issue tracker. */
  external_tracker_url?: string;
}

/** ExternalWiki represents setting for external wiki */
export interface ExternalWiki {
  /** URL of external wiki. */
  external_wiki_url?: string;
}

/** FileCommitResponse contains information generated from a Git commit for a repo's file. */
export interface FileCommitResponse {
  author?: CommitUser;
  committer?: CommitUser;
  /** @format date-time */
  created?: string;
  html_url?: string;
  message?: string;
  parents?: CommitMeta[];
  sha?: string;
  tree?: CommitMeta;
  url?: string;
}

/** FileDeleteResponse contains information about a repo's file that was deleted */
export interface FileDeleteResponse {
  commit?: FileCommitResponse;
  content?: any;
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

/** FileLinksResponse contains the links for a repo's file */
export interface FileLinksResponse {
  git?: string;
  html?: string;
  self?: string;
}

/** FileResponse contains information about a repo's file */
export interface FileResponse {
  commit?: FileCommitResponse;
  /** ContentsResponse contains information about a repo's entry's (dir, file, symlink, submodule) metadata and content */
  content?: ContentsResponse;
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

/** FilesResponse contains information about multiple files from a repo */
export interface FilesResponse {
  commit?: FileCommitResponse;
  files?: ContentsResponse[];
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

/** ForgeLike activity data type */
export type ForgeLike = object;

/** ActivityStream OrderedCollection of activities */
export type ForgeOutbox = object;

/** GPGKey a user GPG key to sign commit and tag in repository */
export interface GPGKey {
  can_certify?: boolean;
  can_encrypt_comms?: boolean;
  can_encrypt_storage?: boolean;
  can_sign?: boolean;
  /** @format date-time */
  created_at?: string;
  emails?: GPGKeyEmail[];
  /** @format date-time */
  expires_at?: string;
  /** @format int64 */
  id?: number;
  key_id?: string;
  primary_key_id?: string;
  public_key?: string;
  subkeys?: GPGKey[];
  verified?: boolean;
}

/** GPGKeyEmail an email attached to a GPGKey */
export interface GPGKeyEmail {
  email?: string;
  verified?: boolean;
}

/** GeneralAPISettings contains global api settings exposed by it */
export interface GeneralAPISettings {
  /** @format int64 */
  default_git_trees_per_page?: number;
  /** @format int64 */
  default_max_blob_size?: number;
  /** @format int64 */
  default_paging_num?: number;
  /** @format int64 */
  max_response_items?: number;
}

/** GeneralAttachmentSettings contains global Attachment settings exposed by API */
export interface GeneralAttachmentSettings {
  allowed_types?: string;
  enabled?: boolean;
  /** @format int64 */
  max_files?: number;
  /** @format int64 */
  max_size?: number;
}

/** GeneralRepoSettings contains global repository settings exposed by API */
export interface GeneralRepoSettings {
  forks_disabled?: boolean;
  http_git_disabled?: boolean;
  lfs_disabled?: boolean;
  migrations_disabled?: boolean;
  mirrors_disabled?: boolean;
  stars_disabled?: boolean;
  time_tracking_disabled?: boolean;
}

/** GeneralUISettings contains global ui settings exposed by API */
export interface GeneralUISettings {
  allowed_reactions?: string[];
  custom_emojis?: string[];
  default_theme?: string;
}

/** GenerateRepoOption options when creating repository using a template */
export interface GenerateRepoOption {
  /** include avatar of the template repo */
  avatar?: boolean;
  /** Default branch of the new repository */
  default_branch?: string;
  /** Description of the repository to create */
  description?: string;
  /** include git content of default branch in template repo */
  git_content?: boolean;
  /** include git hooks in template repo */
  git_hooks?: boolean;
  /** include labels in template repo */
  labels?: boolean;
  /**
   * Name of the repository to create
   * @uniqueItems true
   */
  name: string;
  /** The organization or person who will own the new repository */
  owner: string;
  /** Whether the repository is private */
  private?: boolean;
  /** include protected branches in template repo */
  protected_branch?: boolean;
  /** include topics in template repo */
  topics?: boolean;
  /** include webhooks in template repo */
  webhooks?: boolean;
}

/** GitBlob represents a git blob */
export interface GitBlob {
  content?: string;
  encoding?: string;
  sha?: string;
  /** @format int64 */
  size?: number;
  url?: string;
}

/** GitEntry represents a git tree */
export interface GitEntry {
  mode?: string;
  path?: string;
  sha?: string;
  /** @format int64 */
  size?: number;
  type?: string;
  url?: string;
}

/** GitHook represents a Git repository hook */
export interface GitHook {
  content?: string;
  is_active?: boolean;
  name?: string;
}

/** GitObject represents a Git object. */
export interface GitObject {
  sha?: string;
  type?: string;
  url?: string;
}

/** GitTreeResponse returns a git tree */
export interface GitTreeResponse {
  /** @format int64 */
  page?: number;
  sha?: string;
  /** @format int64 */
  total_count?: number;
  tree?: GitEntry[];
  truncated?: boolean;
  url?: string;
}

/** GitignoreTemplateInfo name and text of a gitignore template */
export interface GitignoreTemplateInfo {
  name?: string;
  source?: string;
}

/** Hook a hook is a web hook when one repository changed */
export interface Hook {
  active?: boolean;
  authorization_header?: string;
  branch_filter?: string;
  /** Deprecated: use Metadata instead */
  config?: Record<string, string>;
  content_type?: string;
  /** @format date-time */
  created_at?: string;
  events?: string[];
  /** @format int64 */
  id?: number;
  metadata?: any;
  type?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
}

/** Identity for a person's identity like an author or committer */
export interface Identity {
  /** @format email */
  email?: string;
  name?: string;
}

/** InternalTracker represents settings for internal tracker */
export interface InternalTracker {
  /** Let only contributors track time (Built-in issue tracker) */
  allow_only_contributors_to_track_time?: boolean;
  /** Enable dependencies for issues and pull requests (Built-in issue tracker) */
  enable_issue_dependencies?: boolean;
  /** Enable time tracking (Built-in issue tracker) */
  enable_time_tracker?: boolean;
}

/** Issue represents an issue in a repository */
export interface Issue {
  assets?: Attachment[];
  /** User represents a user */
  assignee?: User;
  assignees?: User[];
  body?: string;
  /** @format date-time */
  closed_at?: string;
  /** @format int64 */
  comments?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  due_date?: string;
  html_url?: string;
  /** @format int64 */
  id?: number;
  is_locked?: boolean;
  labels?: Label[];
  /** Milestone milestone is a collection of issues on one repository */
  milestone?: Milestone;
  /** @format int64 */
  number?: number;
  original_author?: string;
  /** @format int64 */
  original_author_id?: number;
  /** @format int64 */
  pin_order?: number;
  /** PullRequestMeta PR info if an issue is a PR */
  pull_request?: PullRequestMeta;
  ref?: string;
  /** RepositoryMeta basic repository information */
  repository?: RepositoryMeta;
  /** StateType issue state type */
  state?: StateType;
  title?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
  /** User represents a user */
  user?: User;
}

export interface IssueConfig {
  blank_issues_enabled?: boolean;
  contact_links?: IssueConfigContactLink[];
}

export interface IssueConfigContactLink {
  about?: string;
  name?: string;
  url?: string;
}

export interface IssueConfigValidation {
  message?: string;
  valid?: boolean;
}

/** IssueDeadline represents an issue deadline */
export interface IssueDeadline {
  /** @format date-time */
  due_date?: string;
}

/** IssueFormField represents a form field */
export interface IssueFormField {
  attributes?: Record<string, any>;
  id?: string;
  type?: IssueFormFieldType;
  validations?: Record<string, any>;
  visible?: IssueFormFieldVisible[];
}

/** IssueFormFieldType defines issue form field type, can be "markdown", "textarea", "input", "dropdown" or "checkboxes" */
export type IssueFormFieldType = string;

/** IssueFormFieldVisible defines issue form field visible */
export type IssueFormFieldVisible = string;

/** IssueLabelsOption a collection of labels */
export interface IssueLabelsOption {
  /**
   * Labels can be a list of integers representing label IDs
   * or a list of strings representing label names
   */
  labels?: any[];
  /** @format date-time */
  updated_at?: string;
}

/** IssueMeta basic issue information */
export interface IssueMeta {
  /** @format int64 */
  index: number;
  owner: string;
  repo: string;
}

/** IssueTemplate represents an issue template for a repository */
export interface IssueTemplate {
  about?: string;
  body?: IssueFormField[];
  content?: string;
  file_name?: string;
  labels?: IssueTemplateLabels;
  name?: string;
  ref?: string;
  title?: string;
}

export type IssueTemplateLabels = string[];

/** Label a label to an issue or a pr */
export interface Label {
  /** @example "00aabb" */
  color?: string;
  description?: string;
  /** @example false */
  exclusive?: boolean;
  /** @format int64 */
  id?: number;
  /** @example false */
  is_archived?: boolean;
  name?: string;
  url?: string;
}

/** LabelTemplate info of a Label template */
export interface LabelTemplate {
  /** @example "00aabb" */
  color?: string;
  description?: string;
  /** @example false */
  exclusive?: boolean;
  name?: string;
}

/** LicensesInfo contains information about a License */
export interface LicenseTemplateInfo {
  body?: string;
  implementation?: string;
  key?: string;
  name?: string;
  url?: string;
}

/** LicensesListEntry is used for the API */
export interface LicensesTemplateListEntry {
  key?: string;
  name?: string;
  url?: string;
}

/** ListActionRunResponse return a list of ActionRun */
export interface ListActionRunResponse {
  /** @format int64 */
  total_count?: number;
  workflow_runs?: ActionRun[];
}

/** MarkdownOption markdown options */
export interface MarkdownOption {
  /** Context to render */
  Context?: string;
  /** Mode to render (comment, gfm, markdown) */
  Mode?: string;
  /** Text markdown to render */
  Text?: string;
  /** Is it a wiki page ? */
  Wiki?: boolean;
}

/** MarkupOption markup options */
export interface MarkupOption {
  /** The current branch path where the form gets posted */
  BranchPath?: string;
  /** Context to render */
  Context?: string;
  /** File path for detecting extension in file mode */
  FilePath?: string;
  /** Mode to render (comment, gfm, markdown, file) */
  Mode?: string;
  /** Text markup to render */
  Text?: string;
  /** Is it a wiki page ? */
  Wiki?: boolean;
}

/** MergePullRequestForm form for merging Pull Request */
export interface MergePullRequestOption {
  Do: 'merge' | 'rebase' | 'rebase-merge' | 'squash' | 'fast-forward-only' | 'manually-merged';
  MergeCommitID?: string;
  MergeMessageField?: string;
  MergeTitleField?: string;
  delete_branch_after_merge?: boolean;
  force_merge?: boolean;
  head_commit_id?: string;
  merge_when_checks_succeed?: boolean;
}

/**
 * MigrateRepoOptions options for migrating repository's
 * this is used to interact with api v1
 */
export interface MigrateRepoOptions {
  auth_password?: string;
  auth_token?: string;
  auth_username?: string;
  clone_addr: string;
  description?: string;
  issues?: boolean;
  labels?: boolean;
  lfs?: boolean;
  lfs_endpoint?: string;
  milestones?: boolean;
  mirror?: boolean;
  mirror_interval?: string;
  private?: boolean;
  pull_requests?: boolean;
  releases?: boolean;
  repo_name: string;
  /** Name of User or Organisation who will own Repo after migration */
  repo_owner?: string;
  service?: 'git' | 'github' | 'gitea' | 'gitlab' | 'gogs' | 'onedev' | 'gitbucket' | 'codebase' | 'forgejo' | 'pagure';
  /**
   * deprecated (only for backwards compatibility)
   * @format int64
   */
  uid?: number;
  wiki?: boolean;
}

/** Milestone milestone is a collection of issues on one repository */
export interface Milestone {
  /** @format date-time */
  closed_at?: string;
  /** @format int64 */
  closed_issues?: number;
  /** @format date-time */
  created_at?: string;
  description?: string;
  /** @format date-time */
  due_on?: string;
  /** @format int64 */
  id?: number;
  /** @format int64 */
  open_issues?: number;
  /** StateType issue state type */
  state?: StateType;
  title?: string;
  /** @format date-time */
  updated_at?: string;
}

/** NewIssuePinsAllowed represents an API response that says if new Issue Pins are allowed */
export interface NewIssuePinsAllowed {
  issues?: boolean;
  pull_requests?: boolean;
}

/** NodeInfo contains standardized way of exposing metadata about a server running one of the distributed social networks */
export interface NodeInfo {
  metadata?: object;
  openRegistrations?: boolean;
  protocols?: string[];
  /** NodeInfoServices contains the third party sites this server can connect to via their application API */
  services?: NodeInfoServices;
  /** NodeInfoSoftware contains Metadata about server software in use */
  software?: NodeInfoSoftware;
  /** NodeInfoUsage contains usage statistics for this server */
  usage?: NodeInfoUsage;
  version?: string;
}

/** NodeInfoServices contains the third party sites this server can connect to via their application API */
export interface NodeInfoServices {
  inbound?: string[];
  outbound?: string[];
}

/** NodeInfoSoftware contains Metadata about server software in use */
export interface NodeInfoSoftware {
  homepage?: string;
  name?: string;
  repository?: string;
  version?: string;
}

/** NodeInfoUsage contains usage statistics for this server */
export interface NodeInfoUsage {
  /** @format int64 */
  localComments?: number;
  /** @format int64 */
  localPosts?: number;
  /** NodeInfoUsageUsers contains statistics about the users of this server */
  users?: NodeInfoUsageUsers;
}

/** NodeInfoUsageUsers contains statistics about the users of this server */
export interface NodeInfoUsageUsers {
  /** @format int64 */
  activeHalfyear?: number;
  /** @format int64 */
  activeMonth?: number;
  /** @format int64 */
  total?: number;
}

/** Note contains information related to a git note */
export interface Note {
  commit?: Commit;
  message?: string;
}

export interface NoteOptions {
  message?: string;
}

/** NotificationCount number of unread notifications */
export interface NotificationCount {
  /** @format int64 */
  new?: number;
}

/** NotificationSubject contains the notification subject (Issue/Pull/Commit) */
export interface NotificationSubject {
  html_url?: string;
  latest_comment_html_url?: string;
  latest_comment_url?: string;
  /** StateType issue state type */
  state?: StateType;
  title?: string;
  /** NotifySubjectType represent type of notification subject */
  type?: NotifySubjectType;
  url?: string;
}

/** NotificationThread expose Notification on API */
export interface NotificationThread {
  /** @format int64 */
  id?: number;
  pinned?: boolean;
  /** Repository represents a repository */
  repository?: Repository;
  /** NotificationSubject contains the notification subject (Issue/Pull/Commit) */
  subject?: NotificationSubject;
  unread?: boolean;
  /** @format date-time */
  updated_at?: string;
  url?: string;
}

/** NotifySubjectType represent type of notification subject */
export type NotifySubjectType = string;

/** OAuth2Application represents an OAuth2 application. */
export interface OAuth2Application {
  client_id?: string;
  client_secret?: string;
  confidential_client?: boolean;
  /** @format date-time */
  created?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  redirect_uris?: string[];
}

/** Organization represents an organization */
export interface Organization {
  avatar_url?: string;
  /** @format date-time */
  created?: string;
  description?: string;
  email?: string;
  full_name?: string;
  /** @format int64 */
  id?: number;
  location?: string;
  name?: string;
  repo_admin_change_team_access?: boolean;
  /** deprecated */
  username?: string;
  visibility?: string;
  website?: string;
}

/** OrganizationPermissions list different users permissions on an organization */
export interface OrganizationPermissions {
  can_create_repository?: boolean;
  can_read?: boolean;
  can_write?: boolean;
  is_admin?: boolean;
  is_owner?: boolean;
}

/** PRBranchInfo information about a branch */
export interface PRBranchInfo {
  label?: string;
  ref?: string;
  /** Repository represents a repository */
  repo?: Repository;
  /** @format int64 */
  repo_id?: number;
  sha?: string;
}

/** Package represents a package */
export interface Package {
  /** @format date-time */
  created_at?: string;
  /** User represents a user */
  creator?: User;
  html_url?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  /** User represents a user */
  owner?: User;
  /** Repository represents a repository */
  repository?: Repository;
  type?: string;
  version?: string;
}

/** PackageFile represents a package file */
export interface PackageFile {
  /** @format int64 */
  Size?: number;
  /** @format int64 */
  id?: number;
  md5?: string;
  name?: string;
  sha1?: string;
  sha256?: string;
  sha512?: string;
}

/** PayloadCommit represents a commit */
export interface PayloadCommit {
  added?: string[];
  /** PayloadUser represents the author or committer of a commit */
  author?: PayloadUser;
  /** PayloadUser represents the author or committer of a commit */
  committer?: PayloadUser;
  /** sha1 hash of the commit */
  id?: string;
  message?: string;
  modified?: string[];
  removed?: string[];
  /** @format date-time */
  timestamp?: string;
  url?: string;
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

/** PayloadCommitVerification represents the GPG verification of a commit */
export interface PayloadCommitVerification {
  payload?: string;
  reason?: string;
  signature?: string;
  /** PayloadUser represents the author or committer of a commit */
  signer?: PayloadUser;
  verified?: boolean;
}

/** PayloadUser represents the author or committer of a commit */
export interface PayloadUser {
  /** @format email */
  email?: string;
  /** Full name of the commit author */
  name?: string;
  username?: string;
}

/** Permission represents a set of permissions */
export interface Permission {
  admin?: boolean;
  pull?: boolean;
  push?: boolean;
}

/** PublicKey publickey is a user key to push code to repository */
export interface PublicKey {
  /** @format date-time */
  created_at?: string;
  fingerprint?: string;
  /** @format int64 */
  id?: number;
  key?: string;
  key_type?: string;
  read_only?: boolean;
  title?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
  /** User represents a user */
  user?: User;
  verified?: boolean;
}

/** PullRequest represents a pull request */
export interface PullRequest {
  /** @format int64 */
  additions?: number;
  allow_maintainer_edit?: boolean;
  /** User represents a user */
  assignee?: User;
  assignees?: User[];
  /** PRBranchInfo information about a branch */
  base?: PRBranchInfo;
  body?: string;
  /** @format int64 */
  changed_files?: number;
  /** @format date-time */
  closed_at?: string;
  /** @format int64 */
  comments?: number;
  /** @format date-time */
  created_at?: string;
  /** @format int64 */
  deletions?: number;
  diff_url?: string;
  draft?: boolean;
  /** @format date-time */
  due_date?: string;
  /** @format int64 */
  flow?: number;
  /** PRBranchInfo information about a branch */
  head?: PRBranchInfo;
  html_url?: string;
  /** @format int64 */
  id?: number;
  is_locked?: boolean;
  labels?: Label[];
  merge_base?: string;
  merge_commit_sha?: string;
  mergeable?: boolean;
  merged?: boolean;
  /** @format date-time */
  merged_at?: string;
  /** User represents a user */
  merged_by?: User;
  /** Milestone milestone is a collection of issues on one repository */
  milestone?: Milestone;
  /** @format int64 */
  number?: number;
  patch_url?: string;
  /** @format int64 */
  pin_order?: number;
  requested_reviewers?: User[];
  requested_reviewers_teams?: Team[];
  /**
   * number of review comments made on the diff of a PR review (not including comments on commits or issues in a PR)
   * @format int64
   */
  review_comments?: number;
  /** StateType issue state type */
  state?: StateType;
  title?: string;
  /** @format date-time */
  updated_at?: string;
  url?: string;
  /** User represents a user */
  user?: User;
}

/** PullRequestMeta PR info if an issue is a PR */
export interface PullRequestMeta {
  draft?: boolean;
  html_url?: string;
  merged?: boolean;
  /** @format date-time */
  merged_at?: string;
}

/** PullReview represents a pull request review */
export interface PullReview {
  body?: string;
  /** @format int64 */
  comments_count?: number;
  commit_id?: string;
  dismissed?: boolean;
  html_url?: string;
  /** @format int64 */
  id?: number;
  official?: boolean;
  pull_request_url?: string;
  stale?: boolean;
  /** ReviewStateType review state type */
  state?: ReviewStateType;
  /** @format date-time */
  submitted_at?: string;
  /** Team represents a team in an organization */
  team?: Team;
  /** @format date-time */
  updated_at?: string;
  /** User represents a user */
  user?: User;
}

/** PullReviewComment represents a comment on a pull request review */
export interface PullReviewComment {
  body?: string;
  commit_id?: string;
  /** @format date-time */
  created_at?: string;
  diff_hunk?: string;
  /**
   * number of additional lines after the commented line (0 = single line comment)
   * @format int64
   */
  extra_lines_count?: number;
  html_url?: string;
  /** @format int64 */
  id?: number;
  original_commit_id?: string;
  /** @format uint64 */
  original_position?: number;
  path?: string;
  /** @format uint64 */
  position?: number;
  /** @format int64 */
  pull_request_review_id?: number;
  pull_request_url?: string;
  /** User represents a user */
  resolver?: User;
  /** @format date-time */
  updated_at?: string;
  /** User represents a user */
  user?: User;
}

/** PullReviewRequestOptions are options to add or remove pull review requests */
export interface PullReviewRequestOptions {
  reviewers?: string[];
  team_reviewers?: string[];
}

/** PushMirror represents information of a push mirror */
export interface PushMirror {
  branch_filter?: string;
  /** @format date-time */
  created?: string;
  interval?: string;
  last_error?: string;
  /** @format date-time */
  last_update?: string;
  public_key?: string;
  remote_address?: string;
  remote_name?: string;
  repo_name?: string;
  sync_on_commit?: boolean;
}

/** QuotaGroup represents a quota group */
export interface QuotaGroup {
  /** Name of the group */
  name?: string;
  /** Rules associated with the group */
  rules?: QuotaRuleInfo[];
}

/** QuotaGroupList represents a list of quota groups */
export type QuotaGroupList = QuotaGroup[];

/** QuotaInfo represents information about a user's quota */
export interface QuotaInfo {
  /** QuotaGroupList represents a list of quota groups */
  groups?: QuotaGroupList;
  /** QuotaUsed represents the quota usage of a user */
  used?: QuotaUsed;
}

/** QuotaRuleInfo contains information about a quota rule */
export interface QuotaRuleInfo {
  /**
   * The limit set by the rule
   * @format int64
   */
  limit?: number;
  /** Name of the rule (only shown to admins) */
  name?: string;
  /** Subjects the rule affects */
  subjects?: string[];
}

/** QuotaUsed represents the quota usage of a user */
export interface QuotaUsed {
  /** QuotaUsedSize represents the size-based quota usage of a user */
  size?: QuotaUsedSize;
}

/** QuotaUsedArtifact represents an artifact counting towards a user's quota */
export interface QuotaUsedArtifact {
  /** HTML URL to the action run containing the artifact */
  html_url?: string;
  /** Name of the artifact */
  name?: string;
  /**
   * Size of the artifact (compressed)
   * @format int64
   */
  size?: number;
}

/** QuotaUsedArtifactList represents a list of artifacts counting towards a user's quota */
export type QuotaUsedArtifactList = QuotaUsedArtifact[];

/** QuotaUsedAttachment represents an attachment counting towards a user's quota */
export interface QuotaUsedAttachment {
  /** API URL for the attachment */
  api_url?: string;
  /** Context for the attachment: URLs to the containing object */
  contained_in?: {
    /** API URL for the object that contains this attachment */
    api_url?: string;
    /** HTML URL for the object that contains this attachment */
    html_url?: string;
  };
  /** Filename of the attachment */
  name?: string;
  /**
   * Size of the attachment (in bytes)
   * @format int64
   */
  size?: number;
}

/** QuotaUsedAttachmentList represents a list of attachment counting towards a user's quota */
export type QuotaUsedAttachmentList = QuotaUsedAttachment[];

/** QuotaUsedPackage represents a package counting towards a user's quota */
export interface QuotaUsedPackage {
  /** HTML URL to the package version */
  html_url?: string;
  /** Name of the package */
  name?: string;
  /**
   * Size of the package version
   * @format int64
   */
  size?: number;
  /** Type of the package */
  type?: string;
  /** Version of the package */
  version?: string;
}

/** QuotaUsedPackageList represents a list of packages counting towards a user's quota */
export type QuotaUsedPackageList = QuotaUsedPackage[];

/** QuotaUsedSize represents the size-based quota usage of a user */
export interface QuotaUsedSize {
  /** QuotaUsedSizeAssets represents the size-based asset usage of a user */
  assets?: QuotaUsedSizeAssets;
  /** QuotaUsedSizeGit represents the size-based git (lfs) quota usage of a user */
  git?: QuotaUsedSizeGit;
  /** QuotaUsedSizeRepos represents the size-based repository quota usage of a user */
  repos?: QuotaUsedSizeRepos;
}

/** QuotaUsedSizeAssets represents the size-based asset usage of a user */
export interface QuotaUsedSizeAssets {
  /**
   * Storage size used for the user's artifacts
   * @format int64
   */
  artifacts?: number;
  /** QuotaUsedSizeAssetsAttachments represents the size-based attachment quota usage of a user */
  attachments?: QuotaUsedSizeAssetsAttachments;
  /** QuotaUsedSizeAssetsPackages represents the size-based package quota usage of a user */
  packages?: QuotaUsedSizeAssetsPackages;
}

/** QuotaUsedSizeAssetsAttachments represents the size-based attachment quota usage of a user */
export interface QuotaUsedSizeAssetsAttachments {
  /**
   * Storage size used for the user's issue & comment attachments
   * @format int64
   */
  issues?: number;
  /**
   * Storage size used for the user's release attachments
   * @format int64
   */
  releases?: number;
}

/** QuotaUsedSizeAssetsPackages represents the size-based package quota usage of a user */
export interface QuotaUsedSizeAssetsPackages {
  /**
   * Storage suze used for the user's packages
   * @format int64
   */
  all?: number;
}

/** QuotaUsedSizeGit represents the size-based git (lfs) quota usage of a user */
export interface QuotaUsedSizeGit {
  /**
   * Storage size of the user's Git LFS objects
   * @format int64
   */
  LFS?: number;
}

/** QuotaUsedSizeRepos represents the size-based repository quota usage of a user */
export interface QuotaUsedSizeRepos {
  /**
   * Storage size of the user's private repositories
   * @format int64
   */
  private?: number;
  /**
   * Storage size of the user's public repositories
   * @format int64
   */
  public?: number;
}

/** Reaction contain one reaction */
export interface Reaction {
  content?: string;
  /** @format date-time */
  created_at?: string;
  /** User represents a user */
  user?: User;
}

/** Reference represents a Git reference. */
export interface Reference {
  object?: GitObject;
  ref?: string;
  url?: string;
}

/** RegisterRunnerOptions declares the accepted options for registering runners. */
export interface RegisterRunnerOptions {
  /** Description of the runner to register. */
  description?: string;
  /** Register as ephemeral runner https://forgejo.org/docs/latest/admin/actions/security/#ephemeral-runner */
  ephemeral?: boolean;
  /** Name of the runner to register. The name of the runner does not have to be unique. */
  name: string;
}

/** RegisterRunnerResponse contains the details of the just registered runner. */
export interface RegisterRunnerResponse {
  /** @format int64 */
  id?: number;
  token?: string;
  uuid?: string;
}

/** RegistrationToken is a string used to register a runner with a server */
export interface RegistrationToken {
  token?: string;
}

/** Release represents a repository release */
export interface Release {
  /** TagArchiveDownloadCount counts how many times a archive was downloaded */
  archive_download_count?: TagArchiveDownloadCount;
  assets?: Attachment[];
  /** User represents a user */
  author?: User;
  body?: string;
  /** @format date-time */
  created_at?: string;
  draft?: boolean;
  hide_archive_links?: boolean;
  html_url?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  prerelease?: boolean;
  /** @format date-time */
  published_at?: string;
  tag_name?: string;
  tarball_url?: string;
  target_commitish?: string;
  upload_url?: string;
  url?: string;
  zipball_url?: string;
}

/** RenameOrgOption options when renaming an organization */
export interface RenameOrgOption {
  /**
   * New username for this org. This name cannot be in use yet by any other user.
   * @uniqueItems true
   */
  new_name: string;
}

/** RenameUserOption options when renaming a user */
export interface RenameUserOption {
  /**
   * New username for this user. This name cannot be in use yet by any other user.
   * @uniqueItems true
   */
  new_username: string;
}

/** ReplaceFlagsOption options when replacing the flags of a repository */
export interface ReplaceFlagsOption {
  flags?: string[];
}

/** RepoCollaboratorPermission to get repository permission for a collaborator */
export interface RepoCollaboratorPermission {
  permission?: string;
  role_name?: string;
  /** User represents a user */
  user?: User;
}

/** RepoCommit contains information of a commit in the context of a repository. */
export interface RepoCommit {
  author?: CommitUser;
  committer?: CommitUser;
  message?: string;
  tree?: CommitMeta;
  url?: string;
  /** PayloadCommitVerification represents the GPG verification of a commit */
  verification?: PayloadCommitVerification;
}

export interface RepoTargetOption {
  /** Name of repository */
  name: string;
  /** Name of user or organisation that owns the repository */
  owner: string;
}

/** RepoTopicOptions a collection of repo topic names */
export interface RepoTopicOptions {
  /** list of topic names */
  topics?: string[];
}

/** RepoTransfer represents a pending repo transfer */
export interface RepoTransfer {
  /** User represents a user */
  doer?: User;
  /** User represents a user */
  recipient?: User;
  teams?: Team[];
}

/** Repository represents a repository */
export interface Repository {
  allow_fast_forward_only_merge?: boolean;
  allow_merge_commits?: boolean;
  allow_rebase?: boolean;
  allow_rebase_explicit?: boolean;
  allow_rebase_update?: boolean;
  allow_squash_merge?: boolean;
  archived?: boolean;
  /** @format date-time */
  archived_at?: string;
  avatar_url?: string;
  clone_url?: string;
  /** @format date-time */
  created_at?: string;
  default_allow_maintainer_edit?: boolean;
  default_branch?: string;
  default_delete_branch_after_merge?: boolean;
  default_merge_style?: string;
  default_update_style?: string;
  description?: string;
  empty?: boolean;
  /** ExternalTracker represents settings for external tracker */
  external_tracker?: ExternalTracker;
  /** ExternalWiki represents setting for external wiki */
  external_wiki?: ExternalWiki;
  fork?: boolean;
  /** @format int64 */
  forks_count?: number;
  full_name?: string;
  globally_editable_wiki?: boolean;
  has_actions?: boolean;
  has_issues?: boolean;
  has_packages?: boolean;
  has_projects?: boolean;
  has_pull_requests?: boolean;
  has_releases?: boolean;
  /** is the wiki enabled */
  has_wiki?: boolean;
  /** have wiki pages ever been created */
  has_wiki_contents?: boolean;
  html_url?: string;
  /** @format int64 */
  id?: number;
  ignore_whitespace_conflicts?: boolean;
  internal?: boolean;
  /** InternalTracker represents settings for internal tracker */
  internal_tracker?: InternalTracker;
  language?: string;
  languages_url?: string;
  link?: string;
  mirror?: boolean;
  mirror_interval?: string;
  /** @format date-time */
  mirror_updated?: string;
  name?: string;
  /** ObjectFormatName of the underlying git repository */
  object_format_name?: 'sha1' | 'sha256';
  /** @format int64 */
  open_issues_count?: number;
  /** @format int64 */
  open_pr_counter?: number;
  original_url?: string;
  /** User represents a user */
  owner?: User;
  /** Repository represents a repository */
  parent?: Repository;
  /** Permission represents a set of permissions */
  permissions?: Permission;
  private?: boolean;
  /** @format int64 */
  release_counter?: number;
  /** RepoTransfer represents a pending repo transfer */
  repo_transfer?: RepoTransfer;
  /** @format int64 */
  size?: number;
  ssh_url?: string;
  /** @format int64 */
  stars_count?: number;
  template?: boolean;
  topics?: string[];
  /** @format date-time */
  updated_at?: string;
  url?: string;
  /** @format int64 */
  watchers_count?: number;
  website?: string;
  wiki_branch?: string;
  wiki_clone_url?: string;
  wiki_ssh_url?: string;
}

/** RepositoryMeta basic repository information */
export interface RepositoryMeta {
  full_name?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  owner?: string;
}

/** ReviewStateType review state type */
export type ReviewStateType = string;

/** SearchResults results of a successful search */
export interface SearchResults {
  data?: Repository[];
  ok?: boolean;
}

/** Secret represents a secret */
export interface Secret {
  /** @format date-time */
  created_at?: string;
  /** the secret's name */
  name?: string;
}

/** ServerVersion wraps the version of the server */
export interface ServerVersion {
  version?: string;
}

/** SetUserQuotaGroupsOptions represents the quota groups of a user */
export interface SetUserQuotaGroupsOptions {
  /** Quota groups the user shall have */
  groups: string[];
}

/** StateType issue state type */
export type StateType = string;

/** StopWatch represent a running stopwatch */
export interface StopWatch {
  /** @format date-time */
  created?: string;
  duration?: string;
  /** @format int64 */
  issue_index?: number;
  issue_title?: string;
  repo_name?: string;
  repo_owner_name?: string;
  /** @format int64 */
  seconds?: number;
}

/** SubmitPullReviewOptions are options to submit a pending pull review */
export interface SubmitPullReviewOptions {
  body?: string;
  /** ReviewStateType review state type */
  event?: ReviewStateType;
}

/** SyncForkInfo information about syncing a fork */
export interface SyncForkInfo {
  allowed?: boolean;
  base_commit?: string;
  /** @format int64 */
  commits_behind?: number;
  fork_commit?: string;
}

/** Tag represents a repository tag */
export interface Tag {
  /** TagArchiveDownloadCount counts how many times a archive was downloaded */
  archive_download_count?: TagArchiveDownloadCount;
  commit?: CommitMeta;
  id?: string;
  message?: string;
  name?: string;
  tarball_url?: string;
  zipball_url?: string;
}

/** TagArchiveDownloadCount counts how many times a archive was downloaded */
export interface TagArchiveDownloadCount {
  /** @format int64 */
  tar_gz?: number;
  /** @format int64 */
  zip?: number;
}

/** TagProtection represents a tag protection */
export interface TagProtection {
  /** @format date-time */
  created_at?: string;
  /** @format int64 */
  id?: number;
  name_pattern?: string;
  /** @format date-time */
  updated_at?: string;
  whitelist_teams?: string[];
  whitelist_usernames?: string[];
}

/** Team represents a team in an organization */
export interface Team {
  can_create_org_repo?: boolean;
  description?: string;
  /** @format int64 */
  id?: number;
  includes_all_repositories?: boolean;
  name?: string;
  /** Organization represents an organization */
  organization?: Organization;
  permission?: 'none' | 'read' | 'write' | 'admin' | 'owner';
  /** @example ["repo.code","repo.issues","repo.ext_issues","repo.wiki","repo.pulls","repo.releases","repo.projects","repo.ext_wiki"] */
  units?: string[];
  /** @example {"repo.actions":"none","repo.code":"read","repo.ext_issues":"none","repo.ext_wiki":"none","repo.issues":"write","repo.packages":"none","repo.projects":"none","repo.pulls":"owner","repo.releases":"none","repo.wiki":"admin"} */
  units_map?: Record<string, string>;
}

/**
 * TimeStamp defines a timestamp
 * @format int64
 */
export type TimeStamp = number;

/** TimelineComment represents a timeline comment (comment of any type) on a commit or issue */
export interface TimelineComment {
  /** User represents a user */
  assignee?: User;
  /** Team represents a team in an organization */
  assignee_team?: Team;
  body?: string;
  /** @format date-time */
  created_at?: string;
  /** Issue represents an issue in a repository */
  dependent_issue?: Issue;
  html_url?: string;
  /** @format int64 */
  id?: number;
  issue_url?: string;
  /** Label a label to an issue or a pr */
  label?: Label;
  /** Milestone milestone is a collection of issues on one repository */
  milestone?: Milestone;
  new_ref?: string;
  new_title?: string;
  /** Milestone milestone is a collection of issues on one repository */
  old_milestone?: Milestone;
  /** @format int64 */
  old_project_id?: number;
  old_ref?: string;
  old_title?: string;
  /** @format int64 */
  project_id?: number;
  pull_request_url?: string;
  ref_action?: string;
  /** Comment represents a comment on a commit or issue */
  ref_comment?: Comment;
  /** commit SHA where issue/PR was referenced */
  ref_commit_sha?: string;
  /** Issue represents an issue in a repository */
  ref_issue?: Issue;
  /** whether the assignees were removed or added */
  removed_assignee?: boolean;
  /** User represents a user */
  resolve_doer?: User;
  /** @format int64 */
  review_id?: number;
  /** TrackedTime worked time for an issue / pr */
  tracked_time?: TrackedTime;
  type?: string;
  /** @format date-time */
  updated_at?: string;
  /** User represents a user */
  user?: User;
}

/** TopicName a list of repo topic names */
export interface TopicName {
  topics?: string[];
}

/** TopicResponse for returning topics */
export interface TopicResponse {
  /** @format date-time */
  created?: string;
  /** @format int64 */
  id?: number;
  /** @format int64 */
  repo_count?: number;
  topic_name?: string;
  /** @format date-time */
  updated?: string;
}

/** TrackedTime worked time for an issue / pr */
export interface TrackedTime {
  /** @format date-time */
  created?: string;
  /** @format int64 */
  id?: number;
  /** Issue represents an issue in a repository */
  issue?: Issue;
  /**
   * deprecated (only for backwards compatibility)
   * @format int64
   */
  issue_id?: number;
  /**
   * Time in seconds
   * @format int64
   */
  time?: number;
  /**
   * deprecated (only for backwards compatibility)
   * @format int64
   */
  user_id?: number;
  user_name?: string;
}

/** TransferRepoOption options when transfer a repository's ownership */
export interface TransferRepoOption {
  new_owner: string;
  /** ID of the team or teams to add to the repository. Teams can only be added to organization-owned repositories. */
  team_ids?: number[];
}

/** UpdateBranchRepoOption options when updating a branch in a repository */
export interface UpdateBranchRepoOption {
  /**
   * New branch name
   * @uniqueItems true
   */
  name: string;
}

/**
 * UpdateFileOptions options for updating files
 * Note: `author` and `committer` are optional (if only one is given, it will be used for the other, otherwise the authenticated user will be used)
 */
export interface UpdateFileOptions {
  /** Identity for a person's identity like an author or committer */
  author?: Identity;
  /** branch (optional) to base this file from. if not given, the default branch is used */
  branch?: string;
  /** Identity for a person's identity like an author or committer */
  committer?: Identity;
  /** content must be base64 encoded */
  content: string;
  /** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
  dates?: CommitDateOptions;
  /** (optional) will do a force-push if the new branch already exists */
  force_overwrite_new_branch?: boolean;
  /** from_path (optional) is the path of the original file which will be moved/renamed to the path in the URL */
  from_path?: string;
  /** message (optional) for the commit of this file. if not supplied, a default message will be used */
  message?: string;
  /** new_branch (optional) will make a new branch from `branch` before creating the file */
  new_branch?: string;
  /** sha is the SHA for the file that already exists */
  sha: string;
  /** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
  signoff?: boolean;
}

/** UpdateRepoAvatarUserOption options when updating the repo avatar */
export interface UpdateRepoAvatarOption {
  /** image must be base64 encoded */
  image?: string;
}

/** UpdateUserAvatarUserOption options when updating the user avatar */
export interface UpdateUserAvatarOption {
  /** image must be base64 encoded */
  image?: string;
}

/** UpdateVariableOption defines the properties of the variable to update. */
export interface UpdateVariableOption {
  /**
   * New name for the variable. If the field is empty, the variable name won't be updated. Forgejo will convert it to
   * uppercase.
   */
  name?: string;
  /**
   * Value of the variable to update. Special characters will be retained. Line endings will be normalized to LF to
   * match the behaviour of browsers. Encode the data with Base64 if line endings should be retained.
   */
  value: string;
}

/** User represents a user */
export interface User {
  /** Is user active */
  active?: boolean;
  /** URL to the user's avatar */
  avatar_url?: string;
  /** @format date-time */
  created?: string;
  /** the user's description */
  description?: string;
  /** @format email */
  email?: string;
  /**
   * user counts
   * @format int64
   */
  followers_count?: number;
  /** @format int64 */
  following_count?: number;
  /** the user's full name */
  full_name?: string;
  /** URL to the user's profile page */
  html_url?: string;
  /**
   * the user's id
   * @format int64
   */
  id?: number;
  /** Is the user an administrator */
  is_admin?: boolean;
  /** User locale */
  language?: string;
  /** @format date-time */
  last_login?: string;
  /** the user's location */
  location?: string;
  /** the user's username */
  login?: string;
  /**
   * the user's authentication sign-in name.
   * @default "empty"
   */
  login_name?: string;
  /** Is user login prohibited */
  prohibit_login?: boolean;
  /** the user's pronouns */
  pronouns?: string;
  /** Is user restricted */
  restricted?: boolean;
  /**
   * The ID of the user's Authentication Source
   * @format int64
   */
  source_id?: number;
  /** @format int64 */
  starred_repos_count?: number;
  /** User visibility level option: public, limited, private */
  visibility?: string;
  /** the user's website */
  website?: string;
}

/** UserHeatmapData represents the data needed to create a heatmap */
export interface UserHeatmapData {
  /** @format int64 */
  contributions?: number;
  /** TimeStamp defines a timestamp */
  timestamp?: TimeStamp;
}

/** UserSettings represents user settings */
export interface UserSettings {
  description?: string;
  diff_view_style?: string;
  enable_repo_unit_hints?: boolean;
  full_name?: string;
  hide_activity?: boolean;
  /** Privacy */
  hide_email?: boolean;
  hide_pronouns?: boolean;
  language?: string;
  location?: string;
  pronouns?: string;
  theme?: string;
  website?: string;
}

/** UserSettingsOptions represents options to change user settings */
export interface UserSettingsOptions {
  description?: string;
  diff_view_style?: string;
  enable_repo_unit_hints?: boolean;
  full_name?: string;
  hide_activity?: boolean;
  /** Privacy */
  hide_email?: boolean;
  hide_pronouns?: boolean;
  language?: string;
  location?: string;
  pronouns?: string;
  theme?: string;
  website?: string;
}

/** VerifyGPGKeyOption options verifies user GPG key */
export interface VerifyGPGKeyOption {
  armored_signature?: string;
  /** An Signature for a GPG key token */
  key_id: string;
}

/** WatchInfo represents an API watch status of one repository */
export interface WatchInfo {
  /** @format date-time */
  created_at?: string;
  ignored?: boolean;
  reason?: any;
  repository_url?: string;
  subscribed?: boolean;
  url?: string;
}

/** WikiCommit page commit/revision */
export interface WikiCommit {
  author?: CommitUser;
  commiter?: CommitUser;
  message?: string;
  sha?: string;
}

/** WikiCommitList commit/revision list */
export interface WikiCommitList {
  commits?: WikiCommit[];
  /** @format int64 */
  count?: number;
}

/** WikiPage a wiki page */
export interface WikiPage {
  /** @format int64 */
  commit_count?: number;
  /** Page content, base64 encoded */
  content_base64?: string;
  footer?: string;
  html_url?: string;
  /** WikiCommit page commit/revision */
  last_commit?: WikiCommit;
  sidebar?: string;
  sub_url?: string;
  title?: string;
}

/** WikiPageMetaData wiki page meta information */
export interface WikiPageMetaData {
  html_url?: string;
  /** WikiCommit page commit/revision */
  last_commit?: WikiCommit;
  sub_url?: string;
  title?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '/api/v1';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Forgejo API
 * @version 16.0.5+gitea-1.22.0
 * @license This file is distributed under the MIT license for the purpose of interoperability (http://opensource.org/licenses/MIT)
 * @baseUrl /api/v1
 *
 * This documentation describes the Forgejo API.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  actions = {
    /**
     * @description The automatic actions token must be used as the authentication mechanism (<code>Authorization: Bearer $&#x7b;&#x7b; forgejo.token &#x7d;&#x7d;</code>); other types of tokens cannot be used. The token is associated with the job, which must be still running for the request to this endpoint to succeed.
     *
     * @tags miscellaneous
     * @name GetActionsRun
     * @summary Get a workflow run associated with a token
     * @request GET:/actions/run
     * @secure
     */
    getActionsRun: (params: RequestParams = {}) =>
      this.request<ActionRun, any>({
        path: `/actions/run`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  activitypub = {
    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubInstanceActor
     * @summary Returns the instance's Actor
     * @request GET:/activitypub/actor
     * @secure
     */
    activitypubInstanceActor: (params: RequestParams = {}) =>
      this.request<ActivityPub, any>({
        path: `/activitypub/actor`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubInstanceActorInbox
     * @summary Send to the inbox
     * @request POST:/activitypub/actor/inbox
     * @secure
     */
    activitypubInstanceActorInbox: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/activitypub/actor/inbox`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubInstanceActorOutbox
     * @summary Display the outbox (always empty)
     * @request POST:/activitypub/actor/outbox
     * @secure
     */
    activitypubInstanceActorOutbox: (params: RequestParams = {}) =>
      this.request<ForgeOutbox, any>({
        path: `/activitypub/actor/outbox`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubRepository
     * @summary Returns the Repository actor for a repo
     * @request GET:/activitypub/repository-id/{repository-id}
     * @secure
     */
    activitypubRepository: (repositoryId: number, params: RequestParams = {}) =>
      this.request<ActivityPub, any>({
        path: `/activitypub/repository-id/${repositoryId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubRepositoryInbox
     * @summary Send to the inbox
     * @request POST:/activitypub/repository-id/{repository-id}/inbox
     * @secure
     */
    activitypubRepositoryInbox: (repositoryId: number, body: ForgeLike, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/activitypub/repository-id/${repositoryId}/inbox`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubRepositoryOutbox
     * @summary Display the outbox
     * @request POST:/activitypub/repository-id/{repository-id}/outbox
     * @secure
     */
    activitypubRepositoryOutbox: (repositoryId: number, params: RequestParams = {}) =>
      this.request<ForgeOutbox, any>({
        path: `/activitypub/repository-id/${repositoryId}/outbox`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubPerson
     * @summary Returns the Person actor for a user
     * @request GET:/activitypub/user-id/{user-id}
     * @secure
     */
    activitypubPerson: (userId: number, params: RequestParams = {}) =>
      this.request<ActivityPub, any>({
        path: `/activitypub/user-id/${userId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubPersonActivityNote
     * @summary Get a specific activity object of the user
     * @request GET:/activitypub/user-id/{user-id}/activities/{activity-id}
     * @secure
     */
    activitypubPersonActivityNote: (userId: number, activityId: number, params: RequestParams = {}) =>
      this.request<ActivityPub, any>({
        path: `/activitypub/user-id/${userId}/activities/${activityId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubPersonActivity
     * @summary Get a specific activity of the user
     * @request GET:/activitypub/user-id/{user-id}/activities/{activity-id}/activity
     * @secure
     */
    activitypubPersonActivity: (userId: number, activityId: number, params: RequestParams = {}) =>
      this.request<ActivityPub, any>({
        path: `/activitypub/user-id/${userId}/activities/${activityId}/activity`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubPersonInbox
     * @summary Send to the inbox
     * @request POST:/activitypub/user-id/{user-id}/inbox
     * @secure
     */
    activitypubPersonInbox: (userId: number, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/activitypub/user-id/${userId}/inbox`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activitypub
     * @name ActivitypubPersonFeed
     * @summary List the user's recorded activity
     * @request GET:/activitypub/user-id/{user-id}/outbox
     * @secure
     */
    activitypubPersonFeed: (userId: number, params: RequestParams = {}) =>
      this.request<ForgeOutbox, APIForbiddenError>({
        path: `/activitypub/user-id/${userId}/outbox`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags admin
     * @name GetAdminRunners
     * @summary Get all runners, no matter whether they are global runners or scoped to an organization, user, or repository
     * @request GET:/admin/actions/runners
     * @secure
     */
    getAdminRunners: (
      query?: {
        /** whether to include all visible runners (true) or only those that are directly owned by the instance (false) */
        visible?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunner[], APIError | APINotFound>({
        path: `/admin/actions/runners`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name RegisterAdminRunner
     * @summary Register a new global runner
     * @request POST:/admin/actions/runners
     * @secure
     */
    registerAdminRunner: (body: RegisterRunnerOptions, params: RequestParams = {}) =>
      this.request<RegisterRunnerResponse, APIError | APIUnauthorizedError | APINotFound>({
        path: `/admin/actions/runners`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetActionRunJobs
     * @summary Get action run jobs
     * @request GET:/admin/actions/runners/jobs
     * @secure
     */
    adminGetActionRunJobs: (
      query?: {
        /** a comma separated list of labels to search for */
        labels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunJob[], APIForbiddenError>({
        path: `/admin/actions/runners/jobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use the web UI or [`/admin/actions/runners`](#/admin/registerAdminRunner) instead.
     *
     * @tags admin
     * @name AdminGetRunnerRegistrationToken
     * @summary Get a runner registration token for registering global runners
     * @request GET:/admin/actions/runners/registration-token
     * @deprecated
     * @secure
     */
    adminGetRunnerRegistrationToken: (params: RequestParams = {}) =>
      this.request<RegistrationToken, any>({
        path: `/admin/actions/runners/registration-token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetAdminRunner
     * @summary Get a particular runner, no matter whether it is a global runner or scoped to an organization, user, or repository
     * @request GET:/admin/actions/runners/{runner_id}
     * @secure
     */
    getAdminRunner: (runnerId: string, params: RequestParams = {}) =>
      this.request<ActionRunner, APIError | APINotFound>({
        path: `/admin/actions/runners/${runnerId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name DeleteAdminRunner
     * @summary Delete a particular runner, no matter whether it is a global runner or scoped to an organization, user, or repository
     * @request DELETE:/admin/actions/runners/{runner_id}
     * @secure
     */
    deleteAdminRunner: (runnerId: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/admin/actions/runners/${runnerId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCronList
     * @summary List cron tasks
     * @request GET:/admin/cron
     * @secure
     */
    adminCronList: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Cron[], APIForbiddenError>({
        path: `/admin/cron`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCronRun
     * @summary Run cron task
     * @request POST:/admin/cron/{task}
     * @secure
     */
    adminCronRun: (task: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/admin/cron/${task}`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetAllEmails
     * @summary List all users' email addresses
     * @request GET:/admin/emails
     * @secure
     */
    adminGetAllEmails: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Email[], APIForbiddenError>({
        path: `/admin/emails`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminSearchEmails
     * @summary Search users' email addresses
     * @request GET:/admin/emails/search
     * @secure
     */
    adminSearchEmails: (
      query?: {
        /** keyword */
        q?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Email[], APIForbiddenError>({
        path: `/admin/emails/search`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListHooks
     * @summary List global (system) webhooks
     * @request GET:/admin/hooks
     * @secure
     */
    adminListHooks: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Hook[], any>({
        path: `/admin/hooks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateHook
     * @summary Create a hook
     * @request POST:/admin/hooks
     * @secure
     */
    adminCreateHook: (body: CreateHookOption, params: RequestParams = {}) =>
      this.request<Hook, any>({
        path: `/admin/hooks`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetHook
     * @summary Get a hook
     * @request GET:/admin/hooks/{id}
     * @secure
     */
    adminGetHook: (id: number, params: RequestParams = {}) =>
      this.request<Hook, any>({
        path: `/admin/hooks/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteHook
     * @summary Delete a hook
     * @request DELETE:/admin/hooks/{id}
     * @secure
     */
    adminDeleteHook: (id: number, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/hooks/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminEditHook
     * @summary Update a hook
     * @request PATCH:/admin/hooks/{id}
     * @secure
     */
    adminEditHook: (id: number, body: EditHookOption, params: RequestParams = {}) =>
      this.request<Hook, any>({
        path: `/admin/hooks/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetAllOrgs
     * @summary List all organizations
     * @request GET:/admin/orgs
     * @secure
     */
    adminGetAllOrgs: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Organization[], APIForbiddenError>({
        path: `/admin/orgs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListQuotaGroups
     * @summary List the available quota groups
     * @request GET:/admin/quota/groups
     * @secure
     */
    adminListQuotaGroups: (params: RequestParams = {}) =>
      this.request<QuotaGroupList, APIForbiddenError>({
        path: `/admin/quota/groups`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateQuotaGroup
     * @summary Create a new quota group
     * @request POST:/admin/quota/groups
     * @secure
     */
    adminCreateQuotaGroup: (group: CreateQuotaGroupOptions, params: RequestParams = {}) =>
      this.request<QuotaGroup, APIError | APIForbiddenError | APIValidationError>({
        path: `/admin/quota/groups`,
        method: 'POST',
        body: group,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetQuotaGroup
     * @summary Get information about the quota group
     * @request GET:/admin/quota/groups/{quotagroup}
     * @secure
     */
    adminGetQuotaGroup: (quotagroup: string, params: RequestParams = {}) =>
      this.request<QuotaGroup, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/groups/${quotagroup}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteQuotaGroup
     * @summary Delete a quota group
     * @request DELETE:/admin/quota/groups/{quotagroup}
     * @secure
     */
    adminDeleteQuotaGroup: (quotagroup: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/groups/${quotagroup}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminAddRuleToQuotaGroup
     * @summary Adds a rule to a quota group
     * @request PUT:/admin/quota/groups/{quotagroup}/rules/{quotarule}
     * @secure
     */
    adminAddRuleToQuotaGroup: (quotagroup: string, quotarule: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/quota/groups/${quotagroup}/rules/${quotarule}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminRemoveRuleFromQuotaGroup
     * @summary Removes a rule from a quota group
     * @request DELETE:/admin/quota/groups/{quotagroup}/rules/{quotarule}
     * @secure
     */
    adminRemoveRuleFromQuotaGroup: (quotagroup: string, quotarule: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/groups/${quotagroup}/rules/${quotarule}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListUsersInQuotaGroup
     * @summary List users in a quota group
     * @request GET:/admin/quota/groups/{quotagroup}/users
     * @secure
     */
    adminListUsersInQuotaGroup: (quotagroup: string, params: RequestParams = {}) =>
      this.request<User[], APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/groups/${quotagroup}/users`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminAddUserToQuotaGroup
     * @summary Add a user to a quota group
     * @request PUT:/admin/quota/groups/{quotagroup}/users/{username}
     * @secure
     */
    adminAddUserToQuotaGroup: (quotagroup: string, username: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/quota/groups/${quotagroup}/users/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminRemoveUserFromQuotaGroup
     * @summary Remove a user from a quota group
     * @request DELETE:/admin/quota/groups/{quotagroup}/users/{username}
     * @secure
     */
    adminRemoveUserFromQuotaGroup: (quotagroup: string, username: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/groups/${quotagroup}/users/${username}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListQuotaRules
     * @summary List the available quota rules
     * @request GET:/admin/quota/rules
     * @secure
     */
    adminListQuotaRules: (params: RequestParams = {}) =>
      this.request<QuotaRuleInfo[], APIForbiddenError>({
        path: `/admin/quota/rules`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateQuotaRule
     * @summary Create a new quota rule
     * @request POST:/admin/quota/rules
     * @secure
     */
    adminCreateQuotaRule: (rule: CreateQuotaRuleOptions, params: RequestParams = {}) =>
      this.request<QuotaRuleInfo, APIError | APIForbiddenError | APIValidationError>({
        path: `/admin/quota/rules`,
        method: 'POST',
        body: rule,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetQuotaRule
     * @summary Get information about a quota rule
     * @request GET:/admin/quota/rules/{quotarule}
     * @secure
     */
    adminGetQuotaRule: (quotarule: string, params: RequestParams = {}) =>
      this.request<QuotaRuleInfo, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/rules/${quotarule}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteQuotaRule
     * @summary Deletes a quota rule
     * @request DELETE:/admin/quota/rules/{quotarule}
     * @secure
     */
    adminDeleteQuotaRule: (quotarule: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/quota/rules/${quotarule}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminEditQuotaRule
     * @summary Change an existing quota rule
     * @request PATCH:/admin/quota/rules/{quotarule}
     * @secure
     */
    adminEditQuotaRule: (quotarule: string, rule: EditQuotaRuleOptions, params: RequestParams = {}) =>
      this.request<QuotaRuleInfo, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/quota/rules/${quotarule}`,
        method: 'PATCH',
        body: rule,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use [`/admin/actions/runners/jobs`](#/admin/adminGetActionRunJobs) instead.
     *
     * @tags admin
     * @name AdminSearchRunJobs
     * @summary Search action jobs according to filter conditions
     * @request GET:/admin/runners/jobs
     * @deprecated
     * @secure
     */
    adminSearchRunJobs: (
      query?: {
        /** a comma separated list of run job labels to search for */
        labels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunJob[], APIForbiddenError>({
        path: `/admin/runners/jobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use the web UI or [`/admin/actions/runners`](#/admin/registerAdminRunner) instead.
     *
     * @tags admin
     * @name AdminGetRegistrationToken
     * @summary Get a runner registration token for registering global runners
     * @request GET:/admin/runners/registration-token
     * @deprecated
     * @secure
     */
    adminGetRegistrationToken: (params: RequestParams = {}) =>
      this.request<RegistrationToken, any>({
        path: `/admin/runners/registration-token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminUnadoptedList
     * @summary List unadopted repositories
     * @request GET:/admin/unadopted
     * @secure
     */
    adminUnadoptedList: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /** pattern of repositories to search for */
        pattern?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string[], APIForbiddenError>({
        path: `/admin/unadopted`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminAdoptRepository
     * @summary Adopt unadopted files as a repository
     * @request POST:/admin/unadopted/{owner}/{repo}
     * @secure
     */
    adminAdoptRepository: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/admin/unadopted/${owner}/${repo}`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteUnadoptedRepository
     * @summary Delete unadopted files
     * @request DELETE:/admin/unadopted/{owner}/{repo}
     * @secure
     */
    adminDeleteUnadoptedRepository: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError>({
        path: `/admin/unadopted/${owner}/${repo}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminSearchUsers
     * @summary Search users according filter conditions
     * @request GET:/admin/users
     * @secure
     */
    adminSearchUsers: (
      query?: {
        /**
         * ID of the user's login source to search for
         * @format int64
         */
        source_id?: number;
        /** user's login name to search for */
        login_name?: string;
        /** whether or not to filter users with the 2fa enabled */
        is_2fa_enabled?: boolean;
        /** sort order of results */
        sort?: 'oldest' | 'newest' | 'alphabetically' | 'reversealphabetically' | 'recentupdate' | 'leastupdate';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APIForbiddenError>({
        path: `/admin/users`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateUser
     * @summary Create a user account
     * @request POST:/admin/users
     * @secure
     */
    adminCreateUser: (body: CreateUserOption, params: RequestParams = {}) =>
      this.request<User, APIError | APIForbiddenError | APIValidationError>({
        path: `/admin/users`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteUser
     * @summary Delete user account
     * @request DELETE:/admin/users/{username}
     * @secure
     */
    adminDeleteUser: (
      username: string,
      query?: {
        /** purge the user from the system completely */
        purge?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/users/${username}`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminEditUser
     * @summary Edit an existing user
     * @request PATCH:/admin/users/{username}
     * @secure
     */
    adminEditUser: (username: string, body: EditUserOption, params: RequestParams = {}) =>
      this.request<User, APIError | APIForbiddenError | APIValidationError>({
        path: `/admin/users/${username}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListUserEmails
     * @summary List all email addresses for a user
     * @request GET:/admin/users/{username}/emails
     * @secure
     */
    adminListUserEmails: (username: string, params: RequestParams = {}) =>
      this.request<Email[], APIForbiddenError | APINotFound>({
        path: `/admin/users/${username}/emails`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteUserEmails
     * @summary Delete email addresses from a user's account
     * @request DELETE:/admin/users/{username}/emails
     * @secure
     */
    adminDeleteUserEmails: (username: string, body: DeleteEmailOption, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APIValidationError>({
        path: `/admin/users/${username}/emails`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreatePublicKey
     * @summary Add an SSH public key to user's account
     * @request POST:/admin/users/{username}/keys
     * @secure
     */
    adminCreatePublicKey: (username: string, key: CreateKeyOption, params: RequestParams = {}) =>
      this.request<PublicKey, APIForbiddenError | APIValidationError>({
        path: `/admin/users/${username}/keys`,
        method: 'POST',
        body: key,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteUserPublicKey
     * @summary Remove a public key from user's account
     * @request DELETE:/admin/users/{username}/keys/{id}
     * @secure
     */
    adminDeleteUserPublicKey: (username: string, id: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/admin/users/${username}/keys/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateOrg
     * @summary Create an organization
     * @request POST:/admin/users/{username}/orgs
     * @secure
     */
    adminCreateOrg: (username: string, organization: CreateOrgOption, params: RequestParams = {}) =>
      this.request<Organization, APIForbiddenError | APIValidationError>({
        path: `/admin/users/${username}/orgs`,
        method: 'POST',
        body: organization,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminGetUserQuota
     * @summary Get the user's quota info
     * @request GET:/admin/users/{username}/quota
     * @secure
     */
    adminGetUserQuota: (username: string, params: RequestParams = {}) =>
      this.request<QuotaInfo, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/users/${username}/quota`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminSetUserQuotaGroups
     * @summary Set the user's quota groups to a given list.
     * @request POST:/admin/users/{username}/quota/groups
     * @secure
     */
    adminSetUserQuotaGroups: (username: string, groups: SetUserQuotaGroupsOptions, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/users/${username}/quota/groups`,
        method: 'POST',
        body: groups,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminRenameUser
     * @summary Rename a user
     * @request POST:/admin/users/{username}/rename
     * @secure
     */
    adminRenameUser: (username: string, body: RenameUserOption, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APIValidationError>({
        path: `/admin/users/${username}/rename`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateRepo
     * @summary Create a repository on behalf of a user
     * @request POST:/admin/users/{username}/repos
     * @secure
     */
    adminCreateRepo: (username: string, repository: CreateRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/admin/users/${username}/repos`,
        method: 'POST',
        body: repository,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminListUserAccessTokens
     * @summary List the specified user's access tokens
     * @request GET:/admin/users/{username}/tokens
     * @secure
     */
    adminListUserAccessTokens: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AccessToken[], APIForbiddenError | APINotFound>({
        path: `/admin/users/${username}/tokens`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminCreateUserAccessToken
     * @summary Create an access token for the specified user
     * @request POST:/admin/users/{username}/tokens
     * @secure
     */
    adminCreateUserAccessToken: (username: string, body: CreateAccessTokenOption, params: RequestParams = {}) =>
      this.request<AccessToken, APIError | APIForbiddenError | APINotFound>({
        path: `/admin/users/${username}/tokens`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name AdminDeleteUserAccessToken
     * @summary Delete an access token for the specified user
     * @request DELETE:/admin/users/{username}/tokens/{token}
     * @secure
     */
    adminDeleteUserAccessToken: (username: string, token: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound | APIError>({
        path: `/admin/users/${username}/tokens/${token}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  gitignore = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name ListGitignoresTemplates
     * @summary Returns a list of all gitignore templates
     * @request GET:/gitignore/templates
     * @secure
     */
    listGitignoresTemplates: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/gitignore/templates`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetGitignoreTemplateInfo
     * @summary Returns information about a gitignore template
     * @request GET:/gitignore/templates/{name}
     * @secure
     */
    getGitignoreTemplateInfo: (name: string, params: RequestParams = {}) =>
      this.request<GitignoreTemplateInfo, APINotFound>({
        path: `/gitignore/templates/${name}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  label = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name ListLabelTemplates
     * @summary Returns a list of all label templates
     * @request GET:/label/templates
     * @secure
     */
    listLabelTemplates: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/label/templates`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetLabelTemplateInfo
     * @summary Returns all labels in a template
     * @request GET:/label/templates/{name}
     * @secure
     */
    getLabelTemplateInfo: (name: string, params: RequestParams = {}) =>
      this.request<LabelTemplate[], APINotFound>({
        path: `/label/templates/${name}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  licenses = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name ListLicenseTemplates
     * @summary Returns a list of all license templates
     * @request GET:/licenses
     * @secure
     */
    listLicenseTemplates: (params: RequestParams = {}) =>
      this.request<LicensesTemplateListEntry[], any>({
        path: `/licenses`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetLicenseTemplateInfo
     * @summary Returns information about a license template
     * @request GET:/licenses/{name}
     * @secure
     */
    getLicenseTemplateInfo: (name: string, params: RequestParams = {}) =>
      this.request<LicenseTemplateInfo, APINotFound>({
        path: `/licenses/${name}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  markdown = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name RenderMarkdown
     * @summary Render a markdown document as HTML
     * @request POST:/markdown
     * @secure
     */
    renderMarkdown: (body: MarkdownOption, params: RequestParams = {}) =>
      this.request<string, APIValidationError>({
        path: `/markdown`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags miscellaneous
     * @name RenderMarkdownRaw
     * @summary Render raw markdown as HTML
     * @request POST:/markdown/raw
     * @secure
     */
    renderMarkdownRaw: (body: CommitStatusState, params: RequestParams = {}) =>
      this.request<string, APIValidationError>({
        path: `/markdown/raw`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Text,
        ...params,
      }),
  };
  markup = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name RenderMarkup
     * @summary Render a markup document as HTML
     * @request POST:/markup
     * @secure
     */
    renderMarkup: (body: MarkupOption, params: RequestParams = {}) =>
      this.request<string, APIValidationError>({
        path: `/markup`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  nodeinfo = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetNodeInfo
     * @summary Returns the nodeinfo of the Forgejo application
     * @request GET:/nodeinfo
     * @secure
     */
    getNodeInfo: (params: RequestParams = {}) =>
      this.request<NodeInfo, any>({
        path: `/nodeinfo`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  notifications = {
    /**
     * No description
     *
     * @tags notification
     * @name NotifyGetList
     * @summary List users's notification threads
     * @request GET:/notifications
     * @secure
     */
    notifyGetList: (
      query?: {
        /** If true, show notifications marked as read. Default value is false */
        all?: boolean;
        /** Show notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread & pinned. */
        'status-types'?: string[];
        /** filter notifications by subject type */
        'subject-type'?: ('issue' | 'pull' | 'repository')[];
        /**
         * Only show notifications updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show notifications updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationThread[], any>({
        path: `/notifications`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyReadList
     * @summary Mark notification threads as read, pinned or unread
     * @request PUT:/notifications
     * @secure
     */
    notifyReadList: (
      query?: {
        /**
         * Describes the last point that notifications were checked. Anything updated since this time will not be updated.
         * @format date-time
         */
        last_read_at?: string;
        /** If true, mark all notifications on this repo. Default value is false */
        all?: boolean;
        /** Mark notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread. */
        'status-types'?: string[];
        /** Status to mark notifications as, Defaults to read. */
        'to-status'?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationThread[], any>({
        path: `/notifications`,
        method: 'PUT',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyNewAvailable
     * @summary Check if unread notifications exist
     * @request GET:/notifications/new
     * @secure
     */
    notifyNewAvailable: (params: RequestParams = {}) =>
      this.request<NotificationCount, any>({
        path: `/notifications/new`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyGetThread
     * @summary Get notification thread by ID
     * @request GET:/notifications/threads/{id}
     * @secure
     */
    notifyGetThread: (id: number, params: RequestParams = {}) =>
      this.request<NotificationThread, APIForbiddenError | APINotFound>({
        path: `/notifications/threads/${id}`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyReadThread
     * @summary Mark notification thread as read by ID
     * @request PATCH:/notifications/threads/{id}
     * @secure
     */
    notifyReadThread: (
      id: number,
      query?: {
        /**
         * Status to mark notifications as
         * @default "read"
         */
        'to-status'?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationThread, APIForbiddenError | APINotFound>({
        path: `/notifications/threads/${id}`,
        method: 'PATCH',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  org = {
    /**
     * No description
     *
     * @tags organization
     * @name CreateOrgRepoDeprecated
     * @summary Create a repository in an organization
     * @request POST:/org/{org}/repos
     * @deprecated
     * @secure
     */
    createOrgRepoDeprecated: (org: string, body: CreateRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/org/${org}/repos`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  orgs = {
    /**
     * No description
     *
     * @tags organization
     * @name OrgGetAll
     * @summary List all organizations
     * @request GET:/orgs
     * @secure
     */
    orgGetAll: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Organization[], any>({
        path: `/orgs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgCreate
     * @summary Create an organization
     * @request POST:/orgs
     * @secure
     */
    orgCreate: (organization: CreateOrgOption, params: RequestParams = {}) =>
      this.request<Organization, APIForbiddenError | APIValidationError>({
        path: `/orgs`,
        method: 'POST',
        body: organization,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgGet
     * @summary Get an organization
     * @request GET:/orgs/{org}
     * @secure
     */
    orgGet: (org: string, params: RequestParams = {}) =>
      this.request<Organization, APINotFound>({
        path: `/orgs/${org}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDelete
     * @summary Delete an organization
     * @request DELETE:/orgs/{org}
     * @secure
     */
    orgDelete: (org: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/orgs/${org}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgEdit
     * @summary Edit an organization
     * @request PATCH:/orgs/{org}
     * @secure
     */
    orgEdit: (org: string, body: EditOrgOption, params: RequestParams = {}) =>
      this.request<Organization, APINotFound | APIError>({
        path: `/orgs/${org}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name GetOrgRunners
     * @summary Get the organization's runners
     * @request GET:/orgs/{org}/actions/runners
     * @secure
     */
    getOrgRunners: (
      org: string,
      query?: {
        /** whether to include all visible runners (true) or only those that are directly owned by the organization (false) */
        visible?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunner[], APIError | APINotFound>({
        path: `/orgs/${org}/actions/runners`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name RegisterOrgRunner
     * @summary Register a new organization-level runner
     * @request POST:/orgs/{org}/actions/runners
     * @secure
     */
    registerOrgRunner: (org: string, body: RegisterRunnerOptions, params: RequestParams = {}) =>
      this.request<RegisterRunnerResponse, APIError | APIUnauthorizedError | APINotFound>({
        path: `/orgs/${org}/actions/runners`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgSearchRunJobs
     * @summary Search for organization's action jobs according filter conditions
     * @request GET:/orgs/{org}/actions/runners/jobs
     * @secure
     */
    orgSearchRunJobs: (
      org: string,
      query?: {
        /** a comma separated list of run job labels to search for */
        labels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunJob[], APIForbiddenError>({
        path: `/orgs/${org}/actions/runners/jobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use the web UI or [`/orgs/{org}/actions/runners`](#/organization/registerOrgRunner) instead.
     *
     * @tags organization
     * @name OrgGetRunnerRegistrationToken
     * @summary Get the organization's runner registration token
     * @request GET:/orgs/{org}/actions/runners/registration-token
     * @deprecated
     * @secure
     */
    orgGetRunnerRegistrationToken: (org: string, params: RequestParams = {}) =>
      this.request<RegistrationToken, any>({
        path: `/orgs/${org}/actions/runners/registration-token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name GetOrgRunner
     * @summary Get a particular runner that belongs to the organization
     * @request GET:/orgs/{org}/actions/runners/{runner_id}
     * @secure
     */
    getOrgRunner: (org: string, runnerId: string, params: RequestParams = {}) =>
      this.request<ActionRunner, APIError | APINotFound>({
        path: `/orgs/${org}/actions/runners/${runnerId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name DeleteOrgRunner
     * @summary Delete a particular runner that belongs to the organization
     * @request DELETE:/orgs/{org}/actions/runners/{runner_id}
     * @secure
     */
    deleteOrgRunner: (org: string, runnerId: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/runners/${runnerId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListActionsSecrets
     * @summary List actions secrets of an organization
     * @request GET:/orgs/{org}/actions/secrets
     * @secure
     */
    orgListActionsSecrets: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Secret[], APINotFound>({
        path: `/orgs/${org}/actions/secrets`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name UpdateOrgSecret
     * @summary Create or Update a secret value in an organization
     * @request PUT:/orgs/{org}/actions/secrets/{secretname}
     * @secure
     */
    updateOrgSecret: (org: string, secretname: string, body: CreateOrUpdateSecretOption, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/secrets/${secretname}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name DeleteOrgSecret
     * @summary Delete a secret in an organization
     * @request DELETE:/orgs/{org}/actions/secrets/{secretname}
     * @secure
     */
    deleteOrgSecret: (org: string, secretname: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/secrets/${secretname}`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name GetOrgVariablesList
     * @summary List variables of an organization
     * @request GET:/orgs/{org}/actions/variables
     * @secure
     */
    getOrgVariablesList: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionVariable[], APIError | APINotFound>({
        path: `/orgs/${org}/actions/variables`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name GetOrgVariable
     * @summary Get organization's variable by name
     * @request GET:/orgs/{org}/actions/variables/{variablename}
     * @secure
     */
    getOrgVariable: (org: string, variablename: string, params: RequestParams = {}) =>
      this.request<ActionVariable, APIError | APINotFound>({
        path: `/orgs/${org}/actions/variables/${variablename}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name UpdateOrgVariable
     * @summary Update variable in organization
     * @request PUT:/orgs/{org}/actions/variables/{variablename}
     * @secure
     */
    updateOrgVariable: (org: string, variablename: string, body: UpdateVariableOption, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/variables/${variablename}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name CreateOrgVariable
     * @summary Create a new variable in organization
     * @request POST:/orgs/{org}/actions/variables/{variablename}
     * @secure
     */
    createOrgVariable: (org: string, variablename: string, body: CreateVariableOption, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/variables/${variablename}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name DeleteOrgVariable
     * @summary Delete organization's variable by name
     * @request DELETE:/orgs/{org}/actions/variables/{variablename}
     * @secure
     */
    deleteOrgVariable: (org: string, variablename: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/orgs/${org}/actions/variables/${variablename}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListActivityFeeds
     * @summary List an organization's activity feeds
     * @request GET:/orgs/{org}/activities/feeds
     * @secure
     */
    orgListActivityFeeds: (
      org: string,
      query?: {
        /**
         * the date of the activities to be found
         * @format date
         */
        date?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Activity[], APINotFound>({
        path: `/orgs/${org}/activities/feeds`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgUpdateAvatar
     * @summary Update an organization's avatar
     * @request POST:/orgs/{org}/avatar
     * @secure
     */
    orgUpdateAvatar: (org: string, body: UpdateUserAvatarOption, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/orgs/${org}/avatar`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDeleteAvatar
     * @summary Delete an organization's avatar. It will be replaced by a default one
     * @request DELETE:/orgs/{org}/avatar
     * @secure
     */
    orgDeleteAvatar: (org: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/orgs/${org}/avatar`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgBlockUser
     * @summary Blocks a user from the organization
     * @request PUT:/orgs/{org}/block/{username}
     * @secure
     */
    orgBlockUser: (org: string, username: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/orgs/${org}/block/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListHooks
     * @summary List an organization's webhooks
     * @request GET:/orgs/{org}/hooks
     * @secure
     */
    orgListHooks: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Hook[], APINotFound>({
        path: `/orgs/${org}/hooks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgCreateHook
     * @summary Create a hook
     * @request POST:/orgs/{org}/hooks
     * @secure
     */
    orgCreateHook: (org: string, body: CreateHookOption, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/orgs/${org}/hooks`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgGetHook
     * @summary Get a hook
     * @request GET:/orgs/{org}/hooks/{id}
     * @secure
     */
    orgGetHook: (org: string, id: number, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/orgs/${org}/hooks/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDeleteHook
     * @summary Delete a hook
     * @request DELETE:/orgs/{org}/hooks/{id}
     * @secure
     */
    orgDeleteHook: (org: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/orgs/${org}/hooks/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgEditHook
     * @summary Update a hook
     * @request PATCH:/orgs/{org}/hooks/{id}
     * @secure
     */
    orgEditHook: (org: string, id: number, body: EditHookOption, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/orgs/${org}/hooks/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListLabels
     * @summary List an organization's labels
     * @request GET:/orgs/{org}/labels
     * @secure
     */
    orgListLabels: (
      org: string,
      query?: {
        /** Specifies the sorting method: mostissues, leastissues, or reversealphabetically. */
        sort?: 'mostissues' | 'leastissues' | 'reversealphabetically';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Label[], APINotFound>({
        path: `/orgs/${org}/labels`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgCreateLabel
     * @summary Create a label for an organization
     * @request POST:/orgs/{org}/labels
     * @secure
     */
    orgCreateLabel: (org: string, body: CreateLabelOption, params: RequestParams = {}) =>
      this.request<Label, APINotFound | APIValidationError>({
        path: `/orgs/${org}/labels`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgGetLabel
     * @summary Get a single label
     * @request GET:/orgs/{org}/labels/{id}
     * @secure
     */
    orgGetLabel: (org: string, id: number, params: RequestParams = {}) =>
      this.request<Label, APINotFound>({
        path: `/orgs/${org}/labels/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDeleteLabel
     * @summary Delete a label
     * @request DELETE:/orgs/{org}/labels/{id}
     * @secure
     */
    orgDeleteLabel: (org: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/orgs/${org}/labels/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgEditLabel
     * @summary Update a label
     * @request PATCH:/orgs/{org}/labels/{id}
     * @secure
     */
    orgEditLabel: (org: string, id: number, body: EditLabelOption, params: RequestParams = {}) =>
      this.request<Label, APINotFound | APIValidationError>({
        path: `/orgs/${org}/labels/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListBlockedUsers
     * @summary List the organization's blocked users
     * @request GET:/orgs/{org}/list_blocked
     * @secure
     */
    orgListBlockedUsers: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BlockedUser[], any>({
        path: `/orgs/${org}/list_blocked`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListMembers
     * @summary List an organization's members
     * @request GET:/orgs/{org}/members
     * @secure
     */
    orgListMembers: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/orgs/${org}/members`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgIsMember
     * @summary Check if a user is a member of an organization
     * @request GET:/orgs/{org}/members/{username}
     * @secure
     */
    orgIsMember: (org: string, username: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/orgs/${org}/members/${username}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDeleteMember
     * @summary Remove a member from an organization
     * @request DELETE:/orgs/{org}/members/{username}
     * @secure
     */
    orgDeleteMember: (org: string, username: string, params: RequestParams = {}) =>
      this.request<void, APINotFound>({
        path: `/orgs/${org}/members/${username}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListPublicMembers
     * @summary List an organization's public members
     * @request GET:/orgs/{org}/public_members
     * @secure
     */
    orgListPublicMembers: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/orgs/${org}/public_members`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgIsPublicMember
     * @summary Check if a user is a public member of an organization
     * @request GET:/orgs/{org}/public_members/{username}
     * @secure
     */
    orgIsPublicMember: (org: string, username: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/orgs/${org}/public_members/${username}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgPublicizeMember
     * @summary Publicize a user's membership
     * @request PUT:/orgs/{org}/public_members/{username}
     * @secure
     */
    orgPublicizeMember: (org: string, username: string, params: RequestParams = {}) =>
      this.request<void, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/public_members/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgConcealMember
     * @summary Conceal a user's membership
     * @request DELETE:/orgs/{org}/public_members/{username}
     * @secure
     */
    orgConcealMember: (org: string, username: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/public_members/${username}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgGetQuota
     * @summary Get quota information for an organization
     * @request GET:/orgs/{org}/quota
     * @secure
     */
    orgGetQuota: (org: string, params: RequestParams = {}) =>
      this.request<QuotaInfo, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/quota`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListQuotaArtifacts
     * @summary List the artifacts affecting the organization's quota
     * @request GET:/orgs/{org}/quota/artifacts
     * @secure
     */
    orgListQuotaArtifacts: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedArtifactList, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/quota/artifacts`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListQuotaAttachments
     * @summary List the attachments affecting the organization's quota
     * @request GET:/orgs/{org}/quota/attachments
     * @secure
     */
    orgListQuotaAttachments: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedAttachmentList, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/quota/attachments`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgCheckQuota
     * @summary Check if the organization is over quota for a given subject
     * @request GET:/orgs/{org}/quota/check
     * @secure
     */
    orgCheckQuota: (
      org: string,
      query: {
        /** subject of the quota */
        subject: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<boolean, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/orgs/${org}/quota/check`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListQuotaPackages
     * @summary List the packages affecting the organization's quota
     * @request GET:/orgs/{org}/quota/packages
     * @secure
     */
    orgListQuotaPackages: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedPackageList, APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/quota/packages`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name RenameOrg
     * @summary Rename an organization
     * @request POST:/orgs/{org}/rename
     * @secure
     */
    renameOrg: (org: string, body: RenameOrgOption, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APIValidationError>({
        path: `/orgs/${org}/rename`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListRepos
     * @summary List an organization's repos
     * @request GET:/orgs/{org}/repos
     * @secure
     */
    orgListRepos: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/orgs/${org}/repos`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name CreateOrgRepo
     * @summary Create a repository in an organization
     * @request POST:/orgs/{org}/repos
     * @secure
     */
    createOrgRepo: (org: string, body: CreateRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIError | APIForbiddenError | APINotFound>({
        path: `/orgs/${org}/repos`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeams
     * @summary List an organization's teams
     * @request GET:/orgs/{org}/teams
     * @secure
     */
    orgListTeams: (
      org: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Team[], APINotFound>({
        path: `/orgs/${org}/teams`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgCreateTeam
     * @summary Create a team
     * @request POST:/orgs/{org}/teams
     * @secure
     */
    orgCreateTeam: (org: string, body: CreateTeamOption, params: RequestParams = {}) =>
      this.request<Team, APINotFound | APIValidationError>({
        path: `/orgs/${org}/teams`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name TeamSearch
     * @summary Search for teams within an organization
     * @request GET:/orgs/{org}/teams/search
     * @secure
     */
    teamSearch: (
      org: string,
      query?: {
        /** keywords to search */
        q?: string;
        /** include search within team description (defaults to true) */
        include_desc?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: Team[];
          ok?: boolean;
        },
        APINotFound
      >({
        path: `/orgs/${org}/teams/search`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgUnblockUser
     * @summary Unblock a user from the organization
     * @request PUT:/orgs/{org}/unblock/{username}
     * @secure
     */
    orgUnblockUser: (org: string, username: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/orgs/${org}/unblock/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),
  };
  packages = {
    /**
     * No description
     *
     * @tags package
     * @name ListPackages
     * @summary Gets all packages of an owner
     * @request GET:/packages/{owner}
     * @secure
     */
    listPackages: (
      owner: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /** package type filter */
        type?:
          | 'alpine'
          | 'cargo'
          | 'chef'
          | 'composer'
          | 'conan'
          | 'conda'
          | 'container'
          | 'cran'
          | 'debian'
          | 'generic'
          | 'go'
          | 'helm'
          | 'maven'
          | 'npm'
          | 'nuget'
          | 'pub'
          | 'pypi'
          | 'rpm'
          | 'rubygems'
          | 'swift'
          | 'vagrant';
        /** name filter */
        q?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Package[], APINotFound>({
        path: `/packages/${owner}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name LinkPackage
     * @summary Link a package to a repository
     * @request POST:/packages/{owner}/{type}/{name}/-/link/{repo_name}
     * @secure
     */
    linkPackage: (owner: string, type: string, name: string, repoName: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/packages/${owner}/${type}/${name}/-/link/${repoName}`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name UnlinkPackage
     * @summary Unlink a package from a repository
     * @request POST:/packages/{owner}/{type}/{name}/-/unlink
     * @secure
     */
    unlinkPackage: (owner: string, type: string, name: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/packages/${owner}/${type}/${name}/-/unlink`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name GetPackage
     * @summary Gets a package
     * @request GET:/packages/{owner}/{type}/{name}/{version}
     * @secure
     */
    getPackage: (owner: string, type: string, name: string, version: string, params: RequestParams = {}) =>
      this.request<Package, APINotFound>({
        path: `/packages/${owner}/${type}/${name}/${version}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name DeletePackage
     * @summary Delete a package
     * @request DELETE:/packages/{owner}/{type}/{name}/{version}
     * @secure
     */
    deletePackage: (owner: string, type: string, name: string, version: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/packages/${owner}/${type}/${name}/${version}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name ListPackageFiles
     * @summary Gets all files of a package
     * @request GET:/packages/{owner}/{type}/{name}/{version}/files
     * @secure
     */
    listPackageFiles: (owner: string, type: string, name: string, version: string, params: RequestParams = {}) =>
      this.request<PackageFile[], APINotFound>({
        path: `/packages/${owner}/${type}/${name}/${version}/files`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  repos = {
    /**
     * No description
     *
     * @tags issue
     * @name IssueSearchIssues
     * @summary Search for issues across the repositories that the user has access to
     * @request GET:/repos/issues/search
     * @secure
     */
    issueSearchIssues: (
      query?: {
        /**
         * State of the issue
         * @default "open"
         */
        state?: 'open' | 'closed' | 'all';
        /** Comma-separated list of label names. Fetch only issues that have any of these labels. Non existent labels are discarded. */
        labels?: string;
        /** Comma-separated list of milestone names. Fetch only issues that have any of these milestones. Non existent milestones are discarded. */
        milestones?: string;
        /** Search string */
        q?: string;
        /**
         * Repository ID to prioritize in the results
         * @format int64
         */
        priority_repo_id?: number;
        /** Filter by issue type */
        type?: 'issues' | 'pulls';
        /**
         * Only show issues updated after the given time (RFC 3339 format)
         * @format date-time
         */
        since?: string;
        /**
         * Only show issues updated before the given time (RFC 3339 format)
         * @format date-time
         */
        before?: string;
        /**
         * Filter issues or pulls assigned to the authenticated user
         * @default false
         */
        assigned?: boolean;
        /**
         * Filter issues or pulls created by the authenticated user
         * @default false
         */
        created?: boolean;
        /**
         * Filter issues or pulls mentioning the authenticated user
         * @default false
         */
        mentioned?: boolean;
        /**
         * Filter pull requests where the authenticated user's review was requested
         * @default false
         */
        review_requested?: boolean;
        /**
         * Filter pull requests reviewed by the authenticated user
         * @default false
         */
        reviewed?: boolean;
        /** Filter by repository owner */
        owner?: string;
        /** Filter by team (requires organization owner parameter) */
        team?: string;
        /**
         * Page number of results to return (1-based)
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Number of items per page
         * @min 0
         */
        limit?: number;
        /**
         * Type of sort
         * @default "latest"
         */
        sort?:
          | 'relevance'
          | 'latest'
          | 'oldest'
          | 'recentupdate'
          | 'leastupdate'
          | 'mostcomment'
          | 'leastcomment'
          | 'nearduedate'
          | 'farduedate';
      },
      params: RequestParams = {},
    ) =>
      this.request<Issue[], APIError | APIValidationError>({
        path: `/repos/issues/search`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoMigrate
     * @summary Migrate a remote git repository
     * @request POST:/repos/migrate
     * @secure
     */
    repoMigrate: (body: MigrateRepoOptions, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | void | APIValidationError>({
        path: `/repos/migrate`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSearch
     * @summary Search for repositories
     * @request GET:/repos/search
     * @secure
     */
    repoSearch: (
      query?: {
        /** keyword */
        q?: string;
        /** Limit search to repositories with keyword as topic */
        topic?: boolean;
        /** include search of keyword within repository description */
        includeDesc?: boolean;
        /**
         * search only for repos that the user with the given id owns or contributes to
         * @format int64
         */
        uid?: number;
        /**
         * repo owner to prioritize in the results
         * @format int64
         */
        priority_owner_id?: number;
        /**
         * search only for repos that belong to the given team id
         * @format int64
         */
        team_id?: number;
        /**
         * search only for repos that the user with the given id has starred
         * @format int64
         */
        starredBy?: number;
        /** include private repositories this user has access to (defaults to true) */
        private?: boolean;
        /** show only public, private or all repositories (defaults to all) */
        is_private?: boolean;
        /** show only template, non-template or all repositories (defaults to all) */
        template?: boolean;
        /** show only archived, non-archived or all repositories (defaults to all) */
        archived?: boolean;
        /** type of repository to search for. Supported values are "fork", "source", "mirror" and "collaborative" */
        mode?: string;
        /** if `uid` is given, search only for repos that the user owns */
        exclusive?: boolean;
        /** sort repos by attribute. Supported values are "alpha", "created", "updated", "size", "git_size", "lfs_size", "stars", "forks" and "id". Default is "alpha" */
        sort?: 'alpha' | 'created' | 'updated' | 'size' | 'git_size' | 'lfs_size' | 'id' | 'stars' | 'forks';
        /** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc", ignored if "sort" is not specified. */
        order?: 'asc' | 'desc';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SearchResults, APIValidationError>({
        path: `/repos/search`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGet
     * @summary Get a repository
     * @request GET:/repos/{owner}/{repo}
     * @secure
     */
    repoGet: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Repository, APINotFound>({
        path: `/repos/${owner}/${repo}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDelete
     * @summary Delete a repository
     * @request DELETE:/repos/{owner}/{repo}
     * @secure
     */
    repoDelete: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEdit
     * @summary Edit a repository's properties. Only fields that are set will be changed.
     * @request PATCH:/repos/{owner}/{repo}
     * @secure
     */
    repoEdit: (owner: string, repo: string, body: EditRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListActionArtifacts
     * @summary List a repository's artifacts
     * @request GET:/repos/{owner}/{repo}/actions/artifacts
     * @secure
     */
    listActionArtifacts: (
      owner: string,
      repo: string,
      query?: {
        /** filter by artifact name */
        name?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results, default maximum page size is 50 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionArtifact[], APIError | APIForbiddenError>({
        path: `/repos/${owner}/${repo}/actions/artifacts`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetActionArtifact
     * @summary Get an artifact by ID
     * @request GET:/repos/{owner}/{repo}/actions/artifacts/{artifact_id}
     * @secure
     */
    getActionArtifact: (owner: string, repo: string, artifactId: number, params: RequestParams = {}) =>
      this.request<ActionArtifact, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/artifacts/${artifactId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Marks the artifact for deletion. Storage space will be reclaimed asynchronously by a background job.
     *
     * @tags repository
     * @name DeleteActionArtifact
     * @summary Mark an artifact for deletion
     * @request DELETE:/repos/{owner}/{repo}/actions/artifacts/{artifact_id}
     * @secure
     */
    deleteActionArtifact: (owner: string, repo: string, artifactId: number, params: RequestParams = {}) =>
      this.request<void, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/artifacts/${artifactId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name DownloadActionArtifact
     * @summary Download an artifact
     * @request GET:/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/zip
     * @secure
     */
    downloadActionArtifact: (owner: string, repo: string, artifactId: number, params: RequestParams = {}) =>
      this.request<void, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the plaintext log for the job. By default the log for the most recent attempt is returned (ActionRunJob.TaskID tracks the latest task). Pass `?attempt=N` to fetch the log for a specific historical attempt; the value matches the `attempt` field returned by the job listing endpoints.
     *
     * @tags repository
     * @name RepoGetActionJobLogs
     * @summary Download the plaintext logs of an action job
     * @request GET:/repos/{owner}/{repo}/actions/jobs/{job_id}/logs
     * @secure
     */
    repoGetActionJobLogs: (
      owner: string,
      repo: string,
      jobId: number,
      query?: {
        /**
         * 1-based attempt number matching the value of `attempt` in the job listing; omit to fetch the latest attempt of the job
         * @format int64
         */
        attempt?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommitStatusState, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetRepoRunners
     * @summary Get runners belonging to the repository
     * @request GET:/repos/{owner}/{repo}/actions/runners
     * @secure
     */
    getRepoRunners: (
      owner: string,
      repo: string,
      query?: {
        /** whether to include all visible runners (true) or only those that are directly owned by the repository (false) */
        visible?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunner[], APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runners`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RegisterRepoRunner
     * @summary Register a new repository-level runner
     * @request POST:/repos/{owner}/{repo}/actions/runners
     * @secure
     */
    registerRepoRunner: (owner: string, repo: string, body: RegisterRunnerOptions, params: RequestParams = {}) =>
      this.request<RegisterRunnerResponse, APIError | APIUnauthorizedError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runners`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSearchRunJobs
     * @summary Search for repository's action jobs according filter conditions
     * @request GET:/repos/{owner}/{repo}/actions/runners/jobs
     * @secure
     */
    repoSearchRunJobs: (
      owner: string,
      repo: string,
      query?: {
        /** a comma separated list of run job labels to search for */
        labels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunJob[], APIForbiddenError>({
        path: `/repos/${owner}/${repo}/actions/runners/jobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use the web UI or [`/repos/{owner}/{repo}/actions/runners`](#/repository/registerRepoRunner) instead.
     *
     * @tags repository
     * @name RepoGetRunnerRegistrationToken
     * @summary Get a repository's runner registration token
     * @request GET:/repos/{owner}/{repo}/actions/runners/registration-token
     * @deprecated
     * @secure
     */
    repoGetRunnerRegistrationToken: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<RegistrationToken, any>({
        path: `/repos/${owner}/${repo}/actions/runners/registration-token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetRepoRunner
     * @summary Get a particular runner that belongs to the repository
     * @request GET:/repos/{owner}/{repo}/actions/runners/{runner_id}
     * @secure
     */
    getRepoRunner: (owner: string, repo: string, runnerId: string, params: RequestParams = {}) =>
      this.request<ActionRunner, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runners/${runnerId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name DeleteRepoRunner
     * @summary Delete a particular runner that belongs to a repository
     * @request DELETE:/repos/{owner}/{repo}/actions/runners/{runner_id}
     * @secure
     */
    deleteRepoRunner: (owner: string, repo: string, runnerId: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runners/${runnerId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListActionRuns
     * @summary List a repository's action runs
     * @request GET:/repos/{owner}/{repo}/actions/runs
     * @secure
     */
    listActionRuns: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results, default maximum page size is 50 */
        limit?: number;
        /** Returns workflow run triggered by the specified events. For example, `push`, `pull_request` or `workflow_dispatch`. */
        event?: string[];
        /** Returns workflow runs with the check run status or conclusion that is specified. For example, a conclusion can be success or a status can be in_progress. Only Forgejo Actions can set a status of waiting, pending, or requested. */
        status?: ('unknown' | 'waiting' | 'running' | 'success' | 'failure' | 'cancelled' | 'skipped' | 'blocked')[];
        /**
         * Returns the workflow run associated with the run number.
         * @format int64
         */
        run_number?: number;
        /** Only returns workflow runs that are associated with the specified head_sha. */
        head_sha?: string;
        /** Only return workflow runs that involve the given Git reference, for example, `refs/heads/main`. */
        ref?: string;
        /** Only return workflow runs that involve the given workflow ID. */
        workflow_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListActionRunResponse, APIError | APIForbiddenError>({
        path: `/repos/${owner}/${repo}/actions/runs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ActionRun
     * @summary Get an action run
     * @request GET:/repos/{owner}/{repo}/actions/runs/{run_id}
     * @secure
     */
    actionRun: (owner: string, repo: string, runId: number, params: RequestParams = {}) =>
      this.request<ActionRun, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Remove a particular workflow run. The workflow run must have completed (succeeded, failed, cancelled) for the operation to succeed. Otherwise, an error is returned.
     *
     * @tags repository
     * @name DeleteActionRun
     * @summary Delete a completed workflow run.
     * @request DELETE:/repos/{owner}/{repo}/actions/runs/{run_id}
     * @secure
     */
    deleteActionRun: (owner: string, repo: string, runId: number, params: RequestParams = {}) =>
      this.request<void, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListActionRunArtifacts
     * @summary List artifacts of a workflow run
     * @request GET:/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts
     * @secure
     */
    listActionRunArtifacts: (
      owner: string,
      repo: string,
      runId: number,
      query?: {
        /** filter by artifact name */
        name?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results, default maximum page size is 50 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionArtifact[], APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Cancel a particular workflow run. Pending or running jobs of the run are cancelled. A run that has already finished, whether cancelled, failed, skipped or succeeded, is left unchanged. In both cases the endpoint responds with HTTP 204.
     *
     * @tags repository
     * @name CancelActionRun
     * @summary Cancel a pending or running workflow run.
     * @request POST:/repos/{owner}/{repo}/actions/runs/{run_id}/cancel
     * @secure
     */
    cancelActionRun: (owner: string, repo: string, runId: number, params: RequestParams = {}) =>
      this.request<void, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}/cancel`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListActionRunJobs
     * @summary List jobs of a workflow run
     * @request GET:/repos/{owner}/{repo}/actions/runs/{run_id}/jobs
     * @secure
     */
    listActionRunJobs: (owner: string, repo: string, runId: number, params: RequestParams = {}) =>
      this.request<ActionRunJob[], APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}/jobs`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetActionRunLogs
     * @summary Download a ZIP of plaintext logs for every job in an action run
     * @request GET:/repos/{owner}/{repo}/actions/runs/{run_id}/logs
     * @secure
     */
    repoGetActionRunLogs: (owner: string, repo: string, runId: number, params: RequestParams = {}) =>
      this.request<File, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/runs/${runId}/logs`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListActionsSecrets
     * @summary List an repo's actions secrets
     * @request GET:/repos/{owner}/{repo}/actions/secrets
     * @secure
     */
    repoListActionsSecrets: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Secret[], APINotFound>({
        path: `/repos/${owner}/${repo}/actions/secrets`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UpdateRepoSecret
     * @summary Create or Update a secret value in a repository
     * @request PUT:/repos/{owner}/{repo}/actions/secrets/{secretname}
     * @secure
     */
    updateRepoSecret: (
      owner: string,
      repo: string,
      secretname: string,
      body: CreateOrUpdateSecretOption,
      params: RequestParams = {},
    ) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/secrets/${secretname}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name DeleteRepoSecret
     * @summary Delete a secret in a repository
     * @request DELETE:/repos/{owner}/{repo}/actions/secrets/{secretname}
     * @secure
     */
    deleteRepoSecret: (owner: string, repo: string, secretname: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/secrets/${secretname}`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListActionTasks
     * @summary List a repository's action tasks
     * @request GET:/repos/{owner}/{repo}/actions/tasks
     * @secure
     */
    listActionTasks: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results, default maximum page size is 50 */
        limit?: number;
        /**
         * Returns workflow tasks with the check run status or conclusion that is specified.
         *  For example, a conclusion can be success or a status can be in_progress.
         */
        status?: ('unknown' | 'waiting' | 'running' | 'success' | 'failure' | 'cancelled' | 'skipped' | 'blocked')[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionTaskResponse, APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/actions/tasks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetRepoVariablesList
     * @summary Get repo-level variables list
     * @request GET:/repos/{owner}/{repo}/actions/variables
     * @secure
     */
    getRepoVariablesList: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionVariable[], APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/variables`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetRepoVariable
     * @summary Get a repo-level variable
     * @request GET:/repos/{owner}/{repo}/actions/variables/{variablename}
     * @secure
     */
    getRepoVariable: (owner: string, repo: string, variablename: string, params: RequestParams = {}) =>
      this.request<ActionVariable, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/variables/${variablename}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UpdateRepoVariable
     * @summary Update a repo-level variable
     * @request PUT:/repos/{owner}/{repo}/actions/variables/{variablename}
     * @secure
     */
    updateRepoVariable: (
      owner: string,
      repo: string,
      variablename: string,
      body: UpdateVariableOption,
      params: RequestParams = {},
    ) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/variables/${variablename}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name CreateRepoVariable
     * @summary Create a repo-level variable
     * @request POST:/repos/{owner}/{repo}/actions/variables/{variablename}
     * @secure
     */
    createRepoVariable: (
      owner: string,
      repo: string,
      variablename: string,
      body: CreateVariableOption,
      params: RequestParams = {},
    ) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/variables/${variablename}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name DeleteRepoVariable
     * @summary Delete a repo-level variable
     * @request DELETE:/repos/{owner}/{repo}/actions/variables/{variablename}
     * @secure
     */
    deleteRepoVariable: (owner: string, repo: string, variablename: string, params: RequestParams = {}) =>
      this.request<void, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/actions/variables/${variablename}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name DispatchWorkflow
     * @summary Dispatches a workflow
     * @request POST:/repos/{owner}/{repo}/actions/workflows/{workflowfilename}/dispatches
     * @secure
     */
    dispatchWorkflow: (
      owner: string,
      repo: string,
      workflowfilename: string,
      body: DispatchWorkflowOption,
      params: RequestParams = {},
    ) =>
      this.request<DispatchWorkflowRun, APINotFound>({
        path: `/repos/${owner}/${repo}/actions/workflows/${workflowfilename}/dispatches`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListActivityFeeds
     * @summary List a repository's activity feeds
     * @request GET:/repos/{owner}/{repo}/activities/feeds
     * @secure
     */
    repoListActivityFeeds: (
      owner: string,
      repo: string,
      query?: {
        /**
         * the date of the activities to be found
         * @format date
         */
        date?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Activity[], APINotFound>({
        path: `/repos/${owner}/${repo}/activities/feeds`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetArchive
     * @summary Get an archive of a repository
     * @request GET:/repos/{owner}/{repo}/archive/{archive}
     * @secure
     */
    repoGetArchive: (owner: string, repo: string, archive: string, params: RequestParams = {}) =>
      this.request<void, APINotFound>({
        path: `/repos/${owner}/${repo}/archive/${archive}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetAssignees
     * @summary Return all users that have write access and can be assigned to issues
     * @request GET:/repos/{owner}/{repo}/assignees
     * @secure
     */
    repoGetAssignees: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/assignees`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUpdateAvatar
     * @summary Update a repository's avatar
     * @request POST:/repos/{owner}/{repo}/avatar
     * @secure
     */
    repoUpdateAvatar: (owner: string, repo: string, body: UpdateRepoAvatarOption, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/avatar`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteAvatar
     * @summary Delete a repository's avatar
     * @request DELETE:/repos/{owner}/{repo}/avatar
     * @secure
     */
    repoDeleteAvatar: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/avatar`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListBranchProtection
     * @summary List branch protections for a repository
     * @request GET:/repos/{owner}/{repo}/branch_protections
     * @secure
     */
    repoListBranchProtection: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<BranchProtection[], any>({
        path: `/repos/${owner}/${repo}/branch_protections`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateBranchProtection
     * @summary Create a branch protections for a repository
     * @request POST:/repos/{owner}/{repo}/branch_protections
     * @secure
     */
    repoCreateBranchProtection: (
      owner: string,
      repo: string,
      body: CreateBranchProtectionOption,
      params: RequestParams = {},
    ) =>
      this.request<BranchProtection, APIForbiddenError | APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/branch_protections`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetBranchProtection
     * @summary Get a specific branch protection for the repository
     * @request GET:/repos/{owner}/{repo}/branch_protections/{name}
     * @secure
     */
    repoGetBranchProtection: (owner: string, repo: string, name: string, params: RequestParams = {}) =>
      this.request<BranchProtection, APINotFound>({
        path: `/repos/${owner}/${repo}/branch_protections/${name}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteBranchProtection
     * @summary Delete a specific branch protection for the repository
     * @request DELETE:/repos/{owner}/{repo}/branch_protections/{name}
     * @secure
     */
    repoDeleteBranchProtection: (owner: string, repo: string, name: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/branch_protections/${name}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditBranchProtection
     * @summary Edit a branch protections for a repository. Only fields that are set will be changed
     * @request PATCH:/repos/{owner}/{repo}/branch_protections/{name}
     * @secure
     */
    repoEditBranchProtection: (
      owner: string,
      repo: string,
      name: string,
      body: EditBranchProtectionOption,
      params: RequestParams = {},
    ) =>
      this.request<BranchProtection, APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/branch_protections/${name}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListBranches
     * @summary List a repository's branches
     * @request GET:/repos/{owner}/{repo}/branches
     * @secure
     */
    repoListBranches: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Branch[], any>({
        path: `/repos/${owner}/${repo}/branches`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateBranch
     * @summary Create a branch
     * @request POST:/repos/{owner}/{repo}/branches
     * @secure
     */
    repoCreateBranch: (owner: string, repo: string, body: CreateBranchRepoOption, params: RequestParams = {}) =>
      this.request<Branch, void | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/branches`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetBranch
     * @summary Retrieve a specific branch from a repository, including its effective branch protection
     * @request GET:/repos/{owner}/{repo}/branches/{branch}
     * @secure
     */
    repoGetBranch: (owner: string, repo: string, branch: string, params: RequestParams = {}) =>
      this.request<Branch, APINotFound>({
        path: `/repos/${owner}/${repo}/branches/${branch}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteBranch
     * @summary Delete a specific branch from a repository
     * @request DELETE:/repos/{owner}/{repo}/branches/{branch}
     * @secure
     */
    repoDeleteBranch: (owner: string, repo: string, branch: string, params: RequestParams = {}) =>
      this.request<any, APIError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/branches/${branch}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUpdateBranch
     * @summary Update a branch
     * @request PATCH:/repos/{owner}/{repo}/branches/{branch}
     * @secure
     */
    repoUpdateBranch: (
      owner: string,
      repo: string,
      branch: string,
      body: UpdateBranchRepoOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/branches/${branch}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListCollaborators
     * @summary List a repository's collaborators
     * @request GET:/repos/{owner}/{repo}/collaborators
     * @secure
     */
    repoListCollaborators: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/collaborators`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description If the user is a collaborator, return 204. If the user is not a collaborator, return 404.
     *
     * @tags repository
     * @name RepoCheckCollaborator
     * @summary Check if a user is a collaborator of a repository
     * @request GET:/repos/{owner}/{repo}/collaborators/{collaborator}
     * @secure
     */
    repoCheckCollaborator: (owner: string, repo: string, collaborator: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/collaborators/${collaborator}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoAddCollaborator
     * @summary Add a collaborator to a repository
     * @request PUT:/repos/{owner}/{repo}/collaborators/{collaborator}
     * @secure
     */
    repoAddCollaborator: (
      owner: string,
      repo: string,
      collaborator: string,
      body: AddCollaboratorOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/collaborators/${collaborator}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteCollaborator
     * @summary Delete a collaborator from a repository
     * @request DELETE:/repos/{owner}/{repo}/collaborators/{collaborator}
     * @secure
     */
    repoDeleteCollaborator: (owner: string, repo: string, collaborator: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/collaborators/${collaborator}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetRepoPermissions
     * @summary Get repository permissions for a user
     * @request GET:/repos/{owner}/{repo}/collaborators/{collaborator}/permission
     * @secure
     */
    repoGetRepoPermissions: (owner: string, repo: string, collaborator: string, params: RequestParams = {}) =>
      this.request<RepoCollaboratorPermission, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/collaborators/${collaborator}/permission`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetAllCommits
     * @summary Get a list of all commits from a repository
     * @request GET:/repos/{owner}/{repo}/commits
     * @secure
     */
    repoGetAllCommits: (
      owner: string,
      repo: string,
      query?: {
        /** SHA or branch to start listing commits from (usually 'master') */
        sha?: string;
        /** filepath of a file/dir */
        path?: string;
        /** include diff stats for every commit (disable for speedup, default 'true') */
        stat?: boolean;
        /** include verification for every commit (disable for speedup, default 'true') */
        verification?: boolean;
        /** include a list of affected files for every commit (disable for speedup, default 'true') */
        files?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /** commits that match the given specifier will not be listed. */
        not?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Commit[], APINotFound | APIError>({
        path: `/repos/${owner}/${repo}/commits`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetCombinedStatusByRef
     * @summary Get a commit's combined status, by branch/tag/commit reference
     * @request GET:/repos/{owner}/{repo}/commits/{ref}/status
     * @secure
     */
    repoGetCombinedStatusByRef: (
      owner: string,
      repo: string,
      ref: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CombinedStatus, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/commits/${ref}/status`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListStatusesByRef
     * @summary Get a commit's statuses, by branch/tag/commit reference
     * @request GET:/repos/{owner}/{repo}/commits/{ref}/statuses
     * @secure
     */
    repoListStatusesByRef: (
      owner: string,
      repo: string,
      ref: string,
      query?: {
        /** type of sort */
        sort?: 'oldest' | 'recentupdate' | 'leastupdate' | 'leastindex' | 'highestindex';
        /** type of state */
        state?: 'pending' | 'success' | 'error' | 'failure' | 'warning';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommitStatus[], APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/commits/${ref}/statuses`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetCommitPullRequest
     * @summary Get the pull request of the commit
     * @request GET:/repos/{owner}/{repo}/commits/{sha}/pull
     * @secure
     */
    repoGetCommitPullRequest: (owner: string, repo: string, sha: string, params: RequestParams = {}) =>
      this.request<PullRequest, APINotFound>({
        path: `/repos/${owner}/${repo}/commits/${sha}/pull`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCompareDiff
     * @summary Get commit comparison information
     * @request GET:/repos/{owner}/{repo}/compare/{basehead}
     * @secure
     */
    repoCompareDiff: (owner: string, repo: string, basehead: string, params: RequestParams = {}) =>
      this.request<Compare, APINotFound>({
        path: `/repos/${owner}/${repo}/compare/${basehead}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetContentsList
     * @summary Gets the metadata of all the entries of the root dir
     * @request GET:/repos/{owner}/{repo}/contents
     * @secure
     */
    repoGetContentsList: (
      owner: string,
      repo: string,
      query?: {
        /** The name of the commit/branch/tag. Default the repository’s default branch (usually master) */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContentsResponse[], APINotFound>({
        path: `/repos/${owner}/${repo}/contents`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoChangeFiles
     * @summary Modify multiple files in a repository
     * @request POST:/repos/{owner}/{repo}/contents
     * @secure
     */
    repoChangeFiles: (owner: string, repo: string, body: ChangeFilesOptions, params: RequestParams = {}) =>
      this.request<FilesResponse, APIError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/contents`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetContents
     * @summary Gets the metadata and contents (if a file) of an entry in a repository, or a list of entries if a dir
     * @request GET:/repos/{owner}/{repo}/contents/{filepath}
     * @secure
     */
    repoGetContents: (
      owner: string,
      repo: string,
      filepath: string,
      query?: {
        /** The name of the commit/branch/tag. Default the repository’s default branch (usually master) */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContentsResponse, APINotFound>({
        path: `/repos/${owner}/${repo}/contents/${filepath}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUpdateFile
     * @summary Update a file in a repository
     * @request PUT:/repos/{owner}/{repo}/contents/{filepath}
     * @secure
     */
    repoUpdateFile: (
      owner: string,
      repo: string,
      filepath: string,
      body: UpdateFileOptions,
      params: RequestParams = {},
    ) =>
      this.request<FileResponse, APIError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/contents/${filepath}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateFile
     * @summary Create a file in a repository
     * @request POST:/repos/{owner}/{repo}/contents/{filepath}
     * @secure
     */
    repoCreateFile: (
      owner: string,
      repo: string,
      filepath: string,
      body: CreateFileOptions,
      params: RequestParams = {},
    ) =>
      this.request<FileResponse, APIError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/contents/${filepath}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteFile
     * @summary Delete a file in a repository
     * @request DELETE:/repos/{owner}/{repo}/contents/{filepath}
     * @secure
     */
    repoDeleteFile: (
      owner: string,
      repo: string,
      filepath: string,
      body: DeleteFileOptions,
      params: RequestParams = {},
    ) =>
      this.request<FileDeleteResponse, APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/contents/${filepath}`,
        method: 'DELETE',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoConvert
     * @summary Convert a mirror repo to a normal repo.
     * @request POST:/repos/{owner}/{repo}/convert
     * @secure
     */
    repoConvert: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/convert`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoApplyDiffPatch
     * @summary Apply diff patch to repository
     * @request POST:/repos/{owner}/{repo}/diffpatch
     * @secure
     */
    repoApplyDiffPatch: (owner: string, repo: string, body: UpdateFileOptions, params: RequestParams = {}) =>
      this.request<FileResponse, APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/diffpatch`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetEditorConfig
     * @summary Get the EditorConfig definitions of a file in a repository
     * @request GET:/repos/{owner}/{repo}/editorconfig/{filepath}
     * @secure
     */
    repoGetEditorConfig: (
      owner: string,
      repo: string,
      filepath: string,
      query?: {
        /** The name of the commit/branch/tag. Default the repository’s default branch (usually master) */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreateHookOptionConfig, APINotFound>({
        path: `/repos/${owner}/${repo}/editorconfig/${filepath}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListFlags
     * @summary List a repository's flags
     * @request GET:/repos/{owner}/{repo}/flags
     * @secure
     */
    repoListFlags: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<string[], APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoReplaceAllFlags
     * @summary Replace all flags of a repository
     * @request PUT:/repos/{owner}/{repo}/flags
     * @secure
     */
    repoReplaceAllFlags: (owner: string, repo: string, body: ReplaceFlagsOption, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteAllFlags
     * @summary Remove all flags from a repository
     * @request DELETE:/repos/{owner}/{repo}/flags
     * @secure
     */
    repoDeleteAllFlags: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCheckFlag
     * @summary Check if a repository has a given flag
     * @request GET:/repos/{owner}/{repo}/flags/{flag}
     * @secure
     */
    repoCheckFlag: (owner: string, repo: string, flag: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags/${flag}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoAddFlag
     * @summary Add a flag to a repository
     * @request PUT:/repos/{owner}/{repo}/flags/{flag}
     * @secure
     */
    repoAddFlag: (owner: string, repo: string, flag: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags/${flag}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteFlag
     * @summary Remove a flag from a repository
     * @request DELETE:/repos/{owner}/{repo}/flags/{flag}
     * @secure
     */
    repoDeleteFlag: (owner: string, repo: string, flag: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/flags/${flag}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name ListForks
     * @summary List a repository's forks
     * @request GET:/repos/{owner}/{repo}/forks
     * @secure
     */
    listForks: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/repos/${owner}/${repo}/forks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name CreateFork
     * @summary Fork a repository
     * @request POST:/repos/{owner}/{repo}/forks
     * @secure
     */
    createFork: (owner: string, repo: string, body: CreateForkOption, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | void | APIValidationError>({
        path: `/repos/${owner}/${repo}/forks`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetBlobs
     * @summary Gets multiple blobs of a repository.
     * @request GET:/repos/{owner}/{repo}/git/blobs
     * @secure
     */
    getBlobs: (
      owner: string,
      repo: string,
      query: {
        /** a comma separated list of blob-sha (mind the overall URL-length limit of ~2,083 chars) */
        shas: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GitBlob[], APIError>({
        path: `/repos/${owner}/${repo}/git/blobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetBlob
     * @summary Gets the blob of a repository.
     * @request GET:/repos/{owner}/{repo}/git/blobs/{sha}
     * @secure
     */
    getBlob: (owner: string, repo: string, sha: string, params: RequestParams = {}) =>
      this.request<GitBlob, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/git/blobs/${sha}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetSingleCommit
     * @summary Get a single commit from a repository
     * @request GET:/repos/{owner}/{repo}/git/commits/{sha}
     * @secure
     */
    repoGetSingleCommit: (
      owner: string,
      repo: string,
      sha: string,
      query?: {
        /** include diff stats for every commit (disable for speedup, default 'true') */
        stat?: boolean;
        /** include verification for every commit (disable for speedup, default 'true') */
        verification?: boolean;
        /** include a list of affected files for every commit (disable for speedup, default 'true') */
        files?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Commit, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/git/commits/${sha}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDownloadCommitDiffOrPatch
     * @summary Get a commit's diff or patch
     * @request GET:/repos/{owner}/{repo}/git/commits/{sha}.{diffType}
     * @secure
     */
    repoDownloadCommitDiffOrPatch: (
      owner: string,
      repo: string,
      sha: string,
      diffType: 'diff' | 'patch',
      params: RequestParams = {},
    ) =>
      this.request<string, APINotFound>({
        path: `/repos/${owner}/${repo}/git/commits/${sha}.${diffType}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetNote
     * @summary Get a note corresponding to a single commit from a repository
     * @request GET:/repos/{owner}/{repo}/git/notes/{sha}
     * @secure
     */
    repoGetNote: (
      owner: string,
      repo: string,
      sha: string,
      query?: {
        /** include verification for every commit (disable for speedup, default 'true') */
        verification?: boolean;
        /** include a list of affected files for every commit (disable for speedup, default 'true') */
        files?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Note, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/git/notes/${sha}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSetNote
     * @summary Set a note corresponding to a single commit from a repository
     * @request POST:/repos/{owner}/{repo}/git/notes/{sha}
     * @secure
     */
    repoSetNote: (owner: string, repo: string, sha: string, body: NoteOptions, params: RequestParams = {}) =>
      this.request<Note, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/git/notes/${sha}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoRemoveNote
     * @summary Removes a note corresponding to a single commit from a repository
     * @request DELETE:/repos/{owner}/{repo}/git/notes/{sha}
     * @secure
     */
    repoRemoveNote: (owner: string, repo: string, sha: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/git/notes/${sha}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListAllGitRefs
     * @summary Get specified ref or filtered repository's refs
     * @request GET:/repos/{owner}/{repo}/git/refs
     * @secure
     */
    repoListAllGitRefs: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Reference[], APINotFound>({
        path: `/repos/${owner}/${repo}/git/refs`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListGitRefs
     * @summary Get specified ref or filtered repository's refs
     * @request GET:/repos/{owner}/{repo}/git/refs/{ref}
     * @secure
     */
    repoListGitRefs: (owner: string, repo: string, ref: string, params: RequestParams = {}) =>
      this.request<Reference[], APINotFound>({
        path: `/repos/${owner}/${repo}/git/refs/${ref}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetAnnotatedTag
     * @summary Gets the tag object of an annotated tag (not lightweight tags)
     * @request GET:/repos/{owner}/{repo}/git/tags/{sha}
     * @secure
     */
    getAnnotatedTag: (owner: string, repo: string, sha: string, params: RequestParams = {}) =>
      this.request<AnnotatedTag, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/git/tags/${sha}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GetTree
     * @summary Gets the tree of a repository.
     * @request GET:/repos/{owner}/{repo}/git/trees/{sha}
     * @secure
     */
    getTree: (
      owner: string,
      repo: string,
      sha: string,
      query?: {
        /** show all directories and files */
        recursive?: boolean;
        /** page number; the 'truncated' field in the response will be true if there are still more items after this page, false if the last page */
        page?: number;
        /** number of items per page */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GitTreeResponse, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/git/trees/${sha}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListHooks
     * @summary List the hooks in a repository
     * @request GET:/repos/{owner}/{repo}/hooks
     * @secure
     */
    repoListHooks: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Hook[], APINotFound>({
        path: `/repos/${owner}/${repo}/hooks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateHook
     * @summary Create a hook
     * @request POST:/repos/{owner}/{repo}/hooks
     * @secure
     */
    repoCreateHook: (owner: string, repo: string, body: CreateHookOption, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListGitHooks
     * @summary List the Git hooks in a repository
     * @request GET:/repos/{owner}/{repo}/hooks/git
     * @secure
     */
    repoListGitHooks: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<GitHook[], APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/git`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetGitHook
     * @summary Get a Git hook
     * @request GET:/repos/{owner}/{repo}/hooks/git/{id}
     * @secure
     */
    repoGetGitHook: (owner: string, repo: string, id: string, params: RequestParams = {}) =>
      this.request<GitHook, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/git/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteGitHook
     * @summary Delete a Git hook in a repository
     * @request DELETE:/repos/{owner}/{repo}/hooks/git/{id}
     * @secure
     */
    repoDeleteGitHook: (owner: string, repo: string, id: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/git/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditGitHook
     * @summary Edit a Git hook in a repository
     * @request PATCH:/repos/{owner}/{repo}/hooks/git/{id}
     * @secure
     */
    repoEditGitHook: (owner: string, repo: string, id: string, body: EditGitHookOption, params: RequestParams = {}) =>
      this.request<GitHook, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/git/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetHook
     * @summary Get a hook
     * @request GET:/repos/{owner}/{repo}/hooks/{id}
     * @secure
     */
    repoGetHook: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteHook
     * @summary Delete a hook in a repository
     * @request DELETE:/repos/{owner}/{repo}/hooks/{id}
     * @secure
     */
    repoDeleteHook: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditHook
     * @summary Edit a hook in a repository
     * @request PATCH:/repos/{owner}/{repo}/hooks/{id}
     * @secure
     */
    repoEditHook: (owner: string, repo: string, id: number, body: EditHookOption, params: RequestParams = {}) =>
      this.request<Hook, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoTestHook
     * @summary Test a push webhook
     * @request POST:/repos/{owner}/{repo}/hooks/{id}/tests
     * @secure
     */
    repoTestHook: (
      owner: string,
      repo: string,
      id: number,
      query?: {
        /** The name of the commit/branch/tag, indicates which commit will be loaded to the webhook payload. */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/hooks/${id}/tests`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetIssueConfig
     * @summary Returns the issue config for a repo
     * @request GET:/repos/{owner}/{repo}/issue_config
     * @secure
     */
    repoGetIssueConfig: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<IssueConfig, APINotFound>({
        path: `/repos/${owner}/${repo}/issue_config`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoValidateIssueConfig
     * @summary Returns the validation information for a issue config
     * @request GET:/repos/{owner}/{repo}/issue_config/validate
     * @secure
     */
    repoValidateIssueConfig: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<IssueConfigValidation, APINotFound>({
        path: `/repos/${owner}/${repo}/issue_config/validate`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetIssueTemplates
     * @summary Get available issue templates for a repository
     * @request GET:/repos/{owner}/{repo}/issue_templates
     * @secure
     */
    repoGetIssueTemplates: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<IssueTemplate[], APINotFound>({
        path: `/repos/${owner}/${repo}/issue_templates`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListIssues
     * @summary List a repository's issues
     * @request GET:/repos/{owner}/{repo}/issues
     * @secure
     */
    issueListIssues: (
      owner: string,
      repo: string,
      query?: {
        /** whether issue is open or closed */
        state?: 'closed' | 'open' | 'all';
        /** comma separated list of labels. Fetch only issues that have any of this labels. Non existent labels are discarded */
        labels?: string;
        /** search string */
        q?: string;
        /** filter by type (issues / pulls) if set */
        type?: 'issues' | 'pulls';
        /** comma separated list of milestone names or ids. It uses names and fall back to ids. Fetch only issues that have any of this milestones. Non existent milestones are discarded */
        milestones?: string;
        /**
         * Only show items updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show items updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
        /** Only show items which were created by the given user */
        created_by?: string;
        /** Only show items for which the given user is assigned */
        assigned_by?: string;
        /** Only show items in which the given user was mentioned */
        mentioned_by?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /**
         * Type of sort
         * @default "latest"
         */
        sort?:
          | 'relevance'
          | 'latest'
          | 'oldest'
          | 'recentupdate'
          | 'leastupdate'
          | 'mostcomment'
          | 'leastcomment'
          | 'nearduedate'
          | 'farduedate';
      },
      params: RequestParams = {},
    ) =>
      this.request<Issue[], APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/issues`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateIssue
     * @summary Create an issue. If using deadline only the date will be taken into account, and time of day ignored.
     * @request POST:/repos/{owner}/{repo}/issues
     * @secure
     */
    issueCreateIssue: (owner: string, repo: string, body: CreateIssueOption, params: RequestParams = {}) =>
      this.request<Issue, APIForbiddenError | APINotFound | APIError | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetRepoComments
     * @summary List all comments in a repository
     * @request GET:/repos/{owner}/{repo}/issues/comments
     * @secure
     */
    issueGetRepoComments: (
      owner: string,
      repo: string,
      query?: {
        /**
         * if provided, only comments updated since the provided time are returned.
         * @format date-time
         */
        since?: string;
        /**
         * if provided, only comments updated before the provided time are returned.
         * @format date-time
         */
        before?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Comment[], APINotFound | APIValidationError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/comments`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetComment
     * @summary Get a comment
     * @request GET:/repos/{owner}/{repo}/issues/comments/{id}
     * @secure
     */
    issueGetComment: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Comment, APIForbiddenError | APINotFound | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteComment
     * @summary Delete a comment
     * @request DELETE:/repos/{owner}/{repo}/issues/comments/{id}
     * @secure
     */
    issueDeleteComment: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditComment
     * @summary Edit a comment
     * @request PATCH:/repos/{owner}/{repo}/issues/comments/{id}
     * @secure
     */
    issueEditComment: (
      owner: string,
      repo: string,
      id: number,
      body: EditIssueCommentOption,
      params: RequestParams = {},
    ) =>
      this.request<Comment, APIForbiddenError | APINotFound | APIRepoArchivedError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListIssueCommentAttachments
     * @summary List comment's attachments
     * @request GET:/repos/{owner}/{repo}/issues/comments/{id}/assets
     * @secure
     */
    issueListIssueCommentAttachments: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Attachment[], APIError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/assets`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateIssueCommentAttachment
     * @summary Create a comment attachment
     * @request POST:/repos/{owner}/{repo}/issues/comments/{id}/assets
     * @secure
     */
    issueCreateIssueCommentAttachment: (
      owner: string,
      repo: string,
      id: number,
      data: {
        /** attachment to upload */
        attachment: File;
      },
      query?: {
        /** name of the attachment */
        name?: string;
        /**
         * time of the attachment's creation. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        updated_at?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/assets`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetIssueCommentAttachment
     * @summary Get a comment attachment
     * @request GET:/repos/{owner}/{repo}/issues/comments/{id}/assets/{attachment_id}
     * @secure
     */
    issueGetIssueCommentAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/assets/${attachmentId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteIssueCommentAttachment
     * @summary Delete a comment attachment
     * @request DELETE:/repos/{owner}/{repo}/issues/comments/{id}/assets/{attachment_id}
     * @secure
     */
    issueDeleteIssueCommentAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/assets/${attachmentId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditIssueCommentAttachment
     * @summary Edit a comment attachment
     * @request PATCH:/repos/{owner}/{repo}/issues/comments/{id}/assets/{attachment_id}
     * @secure
     */
    issueEditIssueCommentAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      body: EditAttachmentOptions,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/assets/${attachmentId}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetCommentReactions
     * @summary Get a list of reactions from a comment of an issue
     * @request GET:/repos/{owner}/{repo}/issues/comments/{id}/reactions
     * @secure
     */
    issueGetCommentReactions: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Reaction[], APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/reactions`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssuePostCommentReaction
     * @summary Add a reaction to a comment of an issue
     * @request POST:/repos/{owner}/{repo}/issues/comments/{id}/reactions
     * @secure
     */
    issuePostCommentReaction: (
      owner: string,
      repo: string,
      id: number,
      content: EditReactionOption,
      params: RequestParams = {},
    ) =>
      this.request<Reaction, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/reactions`,
        method: 'POST',
        body: content,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteCommentReaction
     * @summary Remove a reaction from a comment of an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/comments/{id}/reactions
     * @secure
     */
    issueDeleteCommentReaction: (
      owner: string,
      repo: string,
      id: number,
      content: EditReactionOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/comments/${id}/reactions`,
        method: 'DELETE',
        body: content,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListPinnedIssues
     * @summary List a repo's pinned issues
     * @request GET:/repos/{owner}/{repo}/issues/pinned
     * @secure
     */
    repoListPinnedIssues: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Issue[], APINotFound>({
        path: `/repos/${owner}/${repo}/issues/pinned`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetIssue
     * @summary Get an issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}
     * @secure
     */
    issueGetIssue: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<Issue, APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDelete
     * @summary Delete an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}
     * @secure
     */
    issueDelete: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditIssue
     * @summary Edit an issue. If using deadline only the date will be taken into account, and time of day ignored.
     * @request PATCH:/repos/{owner}/{repo}/issues/{index}
     * @secure
     */
    issueEditIssue: (owner: string, repo: string, index: number, body: EditIssueOption, params: RequestParams = {}) =>
      this.request<Issue, APIForbiddenError | APINotFound | APIError>({
        path: `/repos/${owner}/${repo}/issues/${index}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListIssueAttachments
     * @summary List issue's attachments
     * @request GET:/repos/{owner}/{repo}/issues/{index}/assets
     * @secure
     */
    issueListIssueAttachments: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<Attachment[], APIError>({
        path: `/repos/${owner}/${repo}/issues/${index}/assets`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateIssueAttachment
     * @summary Create an issue attachment
     * @request POST:/repos/{owner}/{repo}/issues/{index}/assets
     * @secure
     */
    issueCreateIssueAttachment: (
      owner: string,
      repo: string,
      index: number,
      data: {
        /** attachment to upload */
        attachment: File;
      },
      query?: {
        /** name of the attachment */
        name?: string;
        /**
         * time of the attachment's creation. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        updated_at?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/${index}/assets`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetIssueAttachment
     * @summary Get an issue attachment
     * @request GET:/repos/{owner}/{repo}/issues/{index}/assets/{attachment_id}
     * @secure
     */
    issueGetIssueAttachment: (
      owner: string,
      repo: string,
      index: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError>({
        path: `/repos/${owner}/${repo}/issues/${index}/assets/${attachmentId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteIssueAttachment
     * @summary Delete an issue attachment
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/assets/{attachment_id}
     * @secure
     */
    issueDeleteIssueAttachment: (
      owner: string,
      repo: string,
      index: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/${index}/assets/${attachmentId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditIssueAttachment
     * @summary Edit an issue attachment
     * @request PATCH:/repos/{owner}/{repo}/issues/{index}/assets/{attachment_id}
     * @secure
     */
    issueEditIssueAttachment: (
      owner: string,
      repo: string,
      index: number,
      attachmentId: number,
      body: EditAttachmentOptions,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/${index}/assets/${attachmentId}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListBlocks
     * @summary List issues that are blocked by this issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}/blocks
     * @secure
     */
    issueListBlocks: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Issue[], APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/blocks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateIssueBlocking
     * @summary Block the issue given in the body by the issue in path
     * @request POST:/repos/{owner}/{repo}/issues/{index}/blocks
     * @secure
     */
    issueCreateIssueBlocking: (
      owner: string,
      repo: string,
      index: number,
      body: IssueMeta,
      params: RequestParams = {},
    ) =>
      this.request<Issue, void>({
        path: `/repos/${owner}/${repo}/issues/${index}/blocks`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueRemoveIssueBlocking
     * @summary Unblock the issue given in the body by the issue in path
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/blocks
     * @secure
     */
    issueRemoveIssueBlocking: (
      owner: string,
      repo: string,
      index: number,
      body: IssueMeta,
      params: RequestParams = {},
    ) =>
      this.request<Issue, APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/blocks`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetComments
     * @summary List all comments on an issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}/comments
     * @secure
     */
    issueGetComments: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /**
         * if provided, only comments updated since the specified time are returned.
         * @format date-time
         */
        since?: string;
        /**
         * if provided, only comments updated before the provided time are returned.
         * @format date-time
         */
        before?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Comment[], APINotFound | APIValidationError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/${index}/comments`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateComment
     * @summary Add a comment to an issue
     * @request POST:/repos/{owner}/{repo}/issues/{index}/comments
     * @secure
     */
    issueCreateComment: (
      owner: string,
      repo: string,
      index: number,
      body: CreateIssueCommentOption,
      params: RequestParams = {},
    ) =>
      this.request<Comment, APIForbiddenError | APINotFound | APIRepoArchivedError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/${index}/comments`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteCommentDeprecated
     * @summary Delete a comment
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/comments/{id}
     * @deprecated
     * @secure
     */
    issueDeleteCommentDeprecated: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/${index}/comments/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditCommentDeprecated
     * @summary Edit a comment
     * @request PATCH:/repos/{owner}/{repo}/issues/{index}/comments/{id}
     * @deprecated
     * @secure
     */
    issueEditCommentDeprecated: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      body: EditIssueCommentOption,
      params: RequestParams = {},
    ) =>
      this.request<Comment, APIForbiddenError | APINotFound | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/${index}/comments/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditIssueDeadline
     * @summary Set an issue deadline. If set to null, the deadline is deleted. If using deadline only the date will be taken into account, and time of day ignored.
     * @request POST:/repos/{owner}/{repo}/issues/{index}/deadline
     * @secure
     */
    issueEditIssueDeadline: (
      owner: string,
      repo: string,
      index: number,
      body: EditDeadlineOption,
      params: RequestParams = {},
    ) =>
      this.request<IssueDeadline, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/deadline`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListIssueDependencies
     * @summary List an issue's dependencies, i.e all issues that block this issue.
     * @request GET:/repos/{owner}/{repo}/issues/{index}/dependencies
     * @secure
     */
    issueListIssueDependencies: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Issue[], APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/dependencies`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateIssueDependencies
     * @summary Make the issue in the url depend on the issue in the form.
     * @request POST:/repos/{owner}/{repo}/issues/{index}/dependencies
     * @secure
     */
    issueCreateIssueDependencies: (
      owner: string,
      repo: string,
      index: number,
      body: IssueMeta,
      params: RequestParams = {},
    ) =>
      this.request<Issue, void | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/${index}/dependencies`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueRemoveIssueDependencies
     * @summary Remove an issue dependency
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/dependencies
     * @secure
     */
    issueRemoveIssueDependencies: (
      owner: string,
      repo: string,
      index: number,
      body: IssueMeta,
      params: RequestParams = {},
    ) =>
      this.request<Issue, APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/issues/${index}/dependencies`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetLabels
     * @summary Get an issue's labels
     * @request GET:/repos/{owner}/{repo}/issues/{index}/labels
     * @secure
     */
    issueGetLabels: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<Label[], APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/labels`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueReplaceLabels
     * @summary Replace an issue's labels
     * @request PUT:/repos/{owner}/{repo}/issues/{index}/labels
     * @secure
     */
    issueReplaceLabels: (
      owner: string,
      repo: string,
      index: number,
      body: IssueLabelsOption,
      params: RequestParams = {},
    ) =>
      this.request<Label[], APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/labels`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueAddLabel
     * @summary Add a label to an issue
     * @request POST:/repos/{owner}/{repo}/issues/{index}/labels
     * @secure
     */
    issueAddLabel: (owner: string, repo: string, index: number, body: IssueLabelsOption, params: RequestParams = {}) =>
      this.request<Label[], APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/labels`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueClearLabels
     * @summary Remove all labels from an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/labels
     * @secure
     */
    issueClearLabels: (
      owner: string,
      repo: string,
      index: number,
      body: DeleteLabelsOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/labels`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueRemoveLabel
     * @summary Remove a label from an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/labels/{identifier}
     * @secure
     */
    issueRemoveLabel: (
      owner: string,
      repo: string,
      index: number,
      identifier: string,
      body: DeleteLabelsOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/issues/${index}/labels/${identifier}`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name PinIssue
     * @summary Pin an Issue
     * @request POST:/repos/{owner}/{repo}/issues/{index}/pin
     * @secure
     */
    pinIssue: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/pin`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name UnpinIssue
     * @summary Unpin an Issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/pin
     * @secure
     */
    unpinIssue: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/pin`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name MoveIssuePin
     * @summary Moves the Pin to the given Position
     * @request PATCH:/repos/{owner}/{repo}/issues/{index}/pin/{position}
     * @secure
     */
    moveIssuePin: (owner: string, repo: string, index: number, position: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/pin/${position}`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetIssueReactions
     * @summary Get a list reactions of an issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}/reactions
     * @secure
     */
    issueGetIssueReactions: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Reaction[], APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/reactions`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssuePostIssueReaction
     * @summary Add a reaction to an issue
     * @request POST:/repos/{owner}/{repo}/issues/{index}/reactions
     * @secure
     */
    issuePostIssueReaction: (
      owner: string,
      repo: string,
      index: number,
      content: EditReactionOption,
      params: RequestParams = {},
    ) =>
      this.request<Reaction, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/reactions`,
        method: 'POST',
        body: content,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteIssueReaction
     * @summary Remove a reaction from an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/reactions
     * @secure
     */
    issueDeleteIssueReaction: (
      owner: string,
      repo: string,
      index: number,
      content: EditReactionOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/reactions`,
        method: 'DELETE',
        body: content,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteStopWatch
     * @summary Delete an issue's existing stopwatch.
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/stopwatch/delete
     * @secure
     */
    issueDeleteStopWatch: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, void | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/stopwatch/delete`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueStartStopWatch
     * @summary Start stopwatch on an issue.
     * @request POST:/repos/{owner}/{repo}/issues/{index}/stopwatch/start
     * @secure
     */
    issueStartStopWatch: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, void | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/stopwatch/start`,
        method: 'POST',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueStopStopWatch
     * @summary Stop an issue's existing stopwatch.
     * @request POST:/repos/{owner}/{repo}/issues/{index}/stopwatch/stop
     * @secure
     */
    issueStopStopWatch: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, void | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/stopwatch/stop`,
        method: 'POST',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueSubscriptions
     * @summary Get users who subscribed on an issue.
     * @request GET:/repos/{owner}/{repo}/issues/{index}/subscriptions
     * @secure
     */
    issueSubscriptions: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/subscriptions`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCheckSubscription
     * @summary Check if user is subscribed to an issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}/subscriptions/check
     * @secure
     */
    issueCheckSubscription: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<WatchInfo, APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/subscriptions/check`,
        method: 'GET',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueAddSubscription
     * @summary Subscribe user to issue
     * @request PUT:/repos/{owner}/{repo}/issues/{index}/subscriptions/{user}
     * @secure
     */
    issueAddSubscription: (owner: string, repo: string, index: number, user: string, params: RequestParams = {}) =>
      this.request<void, void | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/subscriptions/${user}`,
        method: 'PUT',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteSubscription
     * @summary Unsubscribe user from issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/subscriptions/{user}
     * @secure
     */
    issueDeleteSubscription: (owner: string, repo: string, index: number, user: string, params: RequestParams = {}) =>
      this.request<void, void | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/subscriptions/${user}`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetCommentsAndTimeline
     * @summary List all comments and events on an issue
     * @request GET:/repos/{owner}/{repo}/issues/{index}/timeline
     * @secure
     */
    issueGetCommentsAndTimeline: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /**
         * if provided, only comments updated since the specified time are returned.
         * @format date-time
         */
        since?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /**
         * if provided, only comments updated before the provided time are returned.
         * @format date-time
         */
        before?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TimelineComment[], APINotFound | APIValidationError | APIInternalServerError>({
        path: `/repos/${owner}/${repo}/issues/${index}/timeline`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueTrackedTimes
     * @summary List an issue's tracked times
     * @request GET:/repos/{owner}/{repo}/issues/{index}/times
     * @secure
     */
    issueTrackedTimes: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** optional filter by user (available for issue managers) */
        user?: string;
        /**
         * Only show times updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show times updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TrackedTime[], APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/issues/${index}/times`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueAddTime
     * @summary Add tracked time to a issue
     * @request POST:/repos/{owner}/{repo}/issues/{index}/times
     * @secure
     */
    issueAddTime: (owner: string, repo: string, index: number, body: AddTimeOption, params: RequestParams = {}) =>
      this.request<TrackedTime, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/times`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueResetTime
     * @summary Reset a tracked time of an issue
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/times
     * @secure
     */
    issueResetTime: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/times`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteTime
     * @summary Delete specific tracked time
     * @request DELETE:/repos/{owner}/{repo}/issues/{index}/times/{id}
     * @secure
     */
    issueDeleteTime: (owner: string, repo: string, index: number, id: number, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/issues/${index}/times/${id}`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListKeys
     * @summary List a repository's keys
     * @request GET:/repos/{owner}/{repo}/keys
     * @secure
     */
    repoListKeys: (
      owner: string,
      repo: string,
      query?: {
        /** the key_id to search for */
        key_id?: number;
        /** fingerprint of the key */
        fingerprint?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DeployKey[], APINotFound>({
        path: `/repos/${owner}/${repo}/keys`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateKey
     * @summary Add a key to a repository
     * @request POST:/repos/{owner}/{repo}/keys
     * @secure
     */
    repoCreateKey: (owner: string, repo: string, body: CreateKeyOption, params: RequestParams = {}) =>
      this.request<DeployKey, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/keys`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetKey
     * @summary Get a repository's key by id
     * @request GET:/repos/{owner}/{repo}/keys/{id}
     * @secure
     */
    repoGetKey: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<DeployKey, APINotFound>({
        path: `/repos/${owner}/${repo}/keys/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteKey
     * @summary Delete a key from a repository
     * @request DELETE:/repos/{owner}/{repo}/keys/{id}
     * @secure
     */
    repoDeleteKey: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/keys/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueListLabels
     * @summary Get all of a repository's labels
     * @request GET:/repos/{owner}/{repo}/labels
     * @secure
     */
    issueListLabels: (
      owner: string,
      repo: string,
      query?: {
        /** Specifies the sorting method: mostissues, leastissues, or reversealphabetically. */
        sort?: 'mostissues' | 'leastissues' | 'reversealphabetically';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Label[], APINotFound>({
        path: `/repos/${owner}/${repo}/labels`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateLabel
     * @summary Create a label
     * @request POST:/repos/{owner}/{repo}/labels
     * @secure
     */
    issueCreateLabel: (owner: string, repo: string, body: CreateLabelOption, params: RequestParams = {}) =>
      this.request<Label, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/labels`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetLabel
     * @summary Get a single label
     * @request GET:/repos/{owner}/{repo}/labels/{id}
     * @secure
     */
    issueGetLabel: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Label, APINotFound>({
        path: `/repos/${owner}/${repo}/labels/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteLabel
     * @summary Delete a label
     * @request DELETE:/repos/{owner}/{repo}/labels/{id}
     * @secure
     */
    issueDeleteLabel: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/labels/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditLabel
     * @summary Update a label
     * @request PATCH:/repos/{owner}/{repo}/labels/{id}
     * @secure
     */
    issueEditLabel: (owner: string, repo: string, id: number, body: EditLabelOption, params: RequestParams = {}) =>
      this.request<Label, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/labels/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetLanguages
     * @summary Get languages and number of bytes of code written
     * @request GET:/repos/{owner}/{repo}/languages
     * @secure
     */
    repoGetLanguages: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Record<string, number>, APINotFound>({
        path: `/repos/${owner}/${repo}/languages`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetRawFileOrLfs
     * @summary Get a file or it's LFS object from a repository
     * @request GET:/repos/{owner}/{repo}/media/{filepath}
     * @secure
     */
    repoGetRawFileOrLfs: (
      owner: string,
      repo: string,
      filepath: string,
      query?: {
        /** The name of the commit/branch/tag. Default the repository’s default branch (usually master) */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, APINotFound>({
        path: `/repos/${owner}/${repo}/media/${filepath}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetMilestonesList
     * @summary Get all of a repository's opened milestones
     * @request GET:/repos/{owner}/{repo}/milestones
     * @secure
     */
    issueGetMilestonesList: (
      owner: string,
      repo: string,
      query?: {
        /** Milestone state, Recognized values are open, closed and all. Defaults to "open" */
        state?: string;
        /** filter by milestone name */
        name?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Milestone[], APINotFound>({
        path: `/repos/${owner}/${repo}/milestones`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueCreateMilestone
     * @summary Create a milestone
     * @request POST:/repos/{owner}/{repo}/milestones
     * @secure
     */
    issueCreateMilestone: (owner: string, repo: string, body: CreateMilestoneOption, params: RequestParams = {}) =>
      this.request<Milestone, APINotFound>({
        path: `/repos/${owner}/${repo}/milestones`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueGetMilestone
     * @summary Get a milestone
     * @request GET:/repos/{owner}/{repo}/milestones/{id}
     * @secure
     */
    issueGetMilestone: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Milestone, APINotFound>({
        path: `/repos/${owner}/${repo}/milestones/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueDeleteMilestone
     * @summary Delete a milestone
     * @request DELETE:/repos/{owner}/{repo}/milestones/{id}
     * @secure
     */
    issueDeleteMilestone: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/milestones/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags issue
     * @name IssueEditMilestone
     * @summary Update a milestone
     * @request PATCH:/repos/{owner}/{repo}/milestones/{id}
     * @secure
     */
    issueEditMilestone: (
      owner: string,
      repo: string,
      id: number,
      body: EditMilestoneOption,
      params: RequestParams = {},
    ) =>
      this.request<Milestone, APINotFound>({
        path: `/repos/${owner}/${repo}/milestones/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoMirrorSync
     * @summary Sync a mirrored repository
     * @request POST:/repos/{owner}/{repo}/mirror-sync
     * @secure
     */
    repoMirrorSync: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/mirror-sync`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoNewPinAllowed
     * @summary Returns if new Issue Pins are allowed
     * @request GET:/repos/{owner}/{repo}/new_pin_allowed
     * @secure
     */
    repoNewPinAllowed: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<NewIssuePinsAllowed, APINotFound>({
        path: `/repos/${owner}/${repo}/new_pin_allowed`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyGetRepoList
     * @summary List users's notification threads on a specific repo
     * @request GET:/repos/{owner}/{repo}/notifications
     * @secure
     */
    notifyGetRepoList: (
      owner: string,
      repo: string,
      query?: {
        /** If true, show notifications marked as read. Default value is false */
        all?: boolean;
        /** Show notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread & pinned */
        'status-types'?: string[];
        /** filter notifications by subject type */
        'subject-type'?: ('issue' | 'pull' | 'repository')[];
        /**
         * Only show notifications updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show notifications updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationThread[], any>({
        path: `/repos/${owner}/${repo}/notifications`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name NotifyReadRepoList
     * @summary Mark notification threads as read, pinned or unread on a specific repo
     * @request PUT:/repos/{owner}/{repo}/notifications
     * @secure
     */
    notifyReadRepoList: (
      owner: string,
      repo: string,
      query?: {
        /** If true, mark all notifications on this repo. Default value is false */
        all?: boolean;
        /** Mark notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread. */
        'status-types'?: string[];
        /** Status to mark notifications as. Defaults to read. */
        'to-status'?: string;
        /**
         * Describes the last point that notifications were checked. Anything updated since this time will not be updated.
         * @format date-time
         */
        last_read_at?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationThread[], any>({
        path: `/repos/${owner}/${repo}/notifications`,
        method: 'PUT',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListPullRequests
     * @summary List a repo's pull requests. If a pull request is selected but fails to be retrieved for any reason, it will be a null value in the list of results.
     * @request GET:/repos/{owner}/{repo}/pulls
     * @secure
     */
    repoListPullRequests: (
      owner: string,
      repo: string,
      query?: {
        /**
         * State of pull request
         * @default "open"
         */
        state?: 'open' | 'closed' | 'all';
        /** Type of sort */
        sort?: 'oldest' | 'recentupdate' | 'recentclose' | 'leastupdate' | 'mostcomment' | 'leastcomment' | 'priority';
        /**
         * ID of the milestone
         * @format int64
         */
        milestone?: number;
        /** Label IDs */
        labels?: number[];
        /** Filter by pull request author */
        poster?: string;
        /** Filter by base branch name */
        base?: string;
        /** Filter by head branch name */
        head?: string;
        /**
         * Page number of results to return (1-based)
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Page size of results
         * @min 0
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PullRequest[], APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/pulls`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreatePullRequest
     * @summary Create a pull request
     * @request POST:/repos/{owner}/{repo}/pulls
     * @secure
     */
    repoCreatePullRequest: (owner: string, repo: string, body: CreatePullRequestOption, params: RequestParams = {}) =>
      this.request<PullRequest, APINotFound | APIError | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/pulls`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListPinnedPullRequests
     * @summary List a repo's pinned pull requests
     * @request GET:/repos/{owner}/{repo}/pulls/pinned
     * @secure
     */
    repoListPinnedPullRequests: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<PullRequest[], APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/pinned`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullRequestByBaseHead
     * @summary Get a pull request by base and head
     * @request GET:/repos/{owner}/{repo}/pulls/{base}/{head}
     * @secure
     */
    repoGetPullRequestByBaseHead: (
      owner: string,
      repo: string,
      base: string,
      head: string,
      params: RequestParams = {},
    ) =>
      this.request<PullRequest, APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${base}/${head}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullRequest
     * @summary Get a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}
     * @secure
     */
    repoGetPullRequest: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<PullRequest, APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditPullRequest
     * @summary Update a pull request. If using deadline only the date will be taken into account, and time of day ignored.
     * @request PATCH:/repos/{owner}/{repo}/pulls/{index}
     * @secure
     */
    repoEditPullRequest: (
      owner: string,
      repo: string,
      index: number,
      body: EditPullRequestOption,
      params: RequestParams = {},
    ) =>
      this.request<PullRequest, APIForbiddenError | APINotFound | APIError | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDownloadPullDiffOrPatch
     * @summary Get a pull request diff or patch
     * @request GET:/repos/{owner}/{repo}/pulls/{index}.{diffType}
     * @secure
     */
    repoDownloadPullDiffOrPatch: (
      owner: string,
      repo: string,
      index: number,
      diffType: 'diff' | 'patch',
      query?: {
        /** whether to include binary file changes. if true, the diff is applicable with `git apply` */
        binary?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}.${diffType}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullRequestCommits
     * @summary Get commits for a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/commits
     * @secure
     */
    repoGetPullRequestCommits: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /** include verification for every commit (disable for speedup, default 'true') */
        verification?: boolean;
        /** include a list of affected files for every commit (disable for speedup, default 'true') */
        files?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Commit[], APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/commits`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullRequestFiles
     * @summary Get changed files for a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/files
     * @secure
     */
    repoGetPullRequestFiles: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** skip to given file */
        'skip-to'?: string;
        /** whitespace behavior */
        whitespace?: 'ignore-all' | 'ignore-change' | 'ignore-eol' | 'show-all';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChangedFile[], APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/files`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoPullRequestIsMerged
     * @summary Check if a pull request has been merged
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/merge
     * @secure
     */
    repoPullRequestIsMerged: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/repos/${owner}/${repo}/pulls/${index}/merge`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoMergePullRequest
     * @summary Merge a pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/merge
     * @secure
     */
    repoMergePullRequest: (
      owner: string,
      repo: string,
      index: number,
      body: MergePullRequestOption,
      params: RequestParams = {},
    ) =>
      this.request<any, APINotFound | APIError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/merge`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCancelScheduledAutoMerge
     * @summary Cancel the scheduled auto merge for the given pull request
     * @request DELETE:/repos/{owner}/{repo}/pulls/{index}/merge
     * @secure
     */
    repoCancelScheduledAutoMerge: (owner: string, repo: string, index: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/merge`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreatePullReviewRequests
     * @summary Create review requests for a pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/requested_reviewers
     * @secure
     */
    repoCreatePullReviewRequests: (
      owner: string,
      repo: string,
      index: number,
      body: PullReviewRequestOptions,
      params: RequestParams = {},
    ) =>
      this.request<PullReview[], APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/requested_reviewers`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeletePullReviewRequests
     * @summary Cancel review requests for a pull request
     * @request DELETE:/repos/{owner}/{repo}/pulls/{index}/requested_reviewers
     * @secure
     */
    repoDeletePullReviewRequests: (
      owner: string,
      repo: string,
      index: number,
      body: PullReviewRequestOptions,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/requested_reviewers`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListPullReviews
     * @summary List all reviews for a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/reviews
     * @secure
     */
    repoListPullReviews: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PullReview[], APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreatePullReview
     * @summary Create a review to an pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/reviews
     * @secure
     */
    repoCreatePullReview: (
      owner: string,
      repo: string,
      index: number,
      body: CreatePullReviewOptions,
      params: RequestParams = {},
    ) =>
      this.request<PullReview, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullReview
     * @summary Get a specific review for a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}
     * @secure
     */
    repoGetPullReview: (owner: string, repo: string, index: number, id: number, params: RequestParams = {}) =>
      this.request<PullReview, APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSubmitPullReview
     * @summary Submit a pending review to an pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}
     * @secure
     */
    repoSubmitPullReview: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      body: SubmitPullReviewOptions,
      params: RequestParams = {},
    ) =>
      this.request<PullReview, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeletePullReview
     * @summary Delete a specific review from a pull request
     * @request DELETE:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}
     * @secure
     */
    repoDeletePullReview: (owner: string, repo: string, index: number, id: number, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullReviewComments
     * @summary Get a specific review for a pull request
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/comments
     * @secure
     */
    repoGetPullReviewComments: (owner: string, repo: string, index: number, id: number, params: RequestParams = {}) =>
      this.request<PullReviewComment[], APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/comments`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreatePullReviewComment
     * @summary Add a new comment to a pull request review
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/comments
     * @secure
     */
    repoCreatePullReviewComment: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      body: CreatePullReviewCommentOptions,
      params: RequestParams = {},
    ) =>
      this.request<PullReviewComment, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/comments`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPullReviewComment
     * @summary Get a pull review comment
     * @request GET:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/comments/{comment}
     * @secure
     */
    repoGetPullReviewComment: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      comment: number,
      params: RequestParams = {},
    ) =>
      this.request<PullReviewComment, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/comments/${comment}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeletePullReviewComment
     * @summary Delete a pull review comment
     * @request DELETE:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/comments/{comment}
     * @secure
     */
    repoDeletePullReviewComment: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      comment: number,
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/comments/${comment}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDismissPullReview
     * @summary Dismiss a review for a pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/dismissals
     * @secure
     */
    repoDismissPullReview: (
      owner: string,
      repo: string,
      index: number,
      id: number,
      body: DismissPullReviewOptions,
      params: RequestParams = {},
    ) =>
      this.request<PullReview, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/dismissals`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUnDismissPullReview
     * @summary Cancel to dismiss a review for a pull request
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/reviews/{id}/undismissals
     * @secure
     */
    repoUnDismissPullReview: (owner: string, repo: string, index: number, id: number, params: RequestParams = {}) =>
      this.request<PullReview, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/reviews/${id}/undismissals`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUpdatePullRequest
     * @summary Merge PR's baseBranch into headBranch
     * @request POST:/repos/{owner}/{repo}/pulls/{index}/update
     * @secure
     */
    repoUpdatePullRequest: (
      owner: string,
      repo: string,
      index: number,
      query?: {
        /** how to update pull request */
        style?: 'merge' | 'rebase';
      },
      params: RequestParams = {},
    ) =>
      this.request<any, APIForbiddenError | APINotFound | APIError | APIValidationError>({
        path: `/repos/${owner}/${repo}/pulls/${index}/update`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListPushMirrors
     * @summary Get all push mirrors of the repository
     * @request GET:/repos/{owner}/{repo}/push_mirrors
     * @secure
     */
    repoListPushMirrors: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PushMirror[], APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/push_mirrors`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoAddPushMirror
     * @summary Set up a new push mirror in a repository
     * @request POST:/repos/{owner}/{repo}/push_mirrors
     * @secure
     */
    repoAddPushMirror: (owner: string, repo: string, body: CreatePushMirrorOption, params: RequestParams = {}) =>
      this.request<PushMirror, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/push_mirrors`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoPushMirrorSync
     * @summary Sync all push mirrored repository
     * @request POST:/repos/{owner}/{repo}/push_mirrors-sync
     * @secure
     */
    repoPushMirrorSync: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/push_mirrors-sync`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetPushMirrorByRemoteName
     * @summary Get push mirror of the repository by remoteName
     * @request GET:/repos/{owner}/{repo}/push_mirrors/{name}
     * @secure
     */
    repoGetPushMirrorByRemoteName: (owner: string, repo: string, name: string, params: RequestParams = {}) =>
      this.request<PushMirror, APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/push_mirrors/${name}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeletePushMirror
     * @summary Remove a push mirror from a repository by remoteName
     * @request DELETE:/repos/{owner}/{repo}/push_mirrors/{name}
     * @secure
     */
    repoDeletePushMirror: (owner: string, repo: string, name: string, params: RequestParams = {}) =>
      this.request<any, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/push_mirrors/${name}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetRawFile
     * @summary Get a file from a repository
     * @request GET:/repos/{owner}/{repo}/raw/{filepath}
     * @secure
     */
    repoGetRawFile: (
      owner: string,
      repo: string,
      filepath: string,
      query?: {
        /** The name of the commit/branch/tag. Default the repository’s default branch (usually master) */
        ref?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, APINotFound>({
        path: `/repos/${owner}/${repo}/raw/${filepath}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListReleases
     * @summary List a repo's releases
     * @request GET:/repos/{owner}/{repo}/releases
     * @secure
     */
    repoListReleases: (
      owner: string,
      repo: string,
      query?: {
        /** filter (exclude / include) drafts, if you dont have repo write access none will show */
        draft?: boolean;
        /** filter (exclude / include) pre-releases */
        'pre-release'?: boolean;
        /** Search string */
        q?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Release[], APINotFound>({
        path: `/repos/${owner}/${repo}/releases`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateRelease
     * @summary Create a release
     * @request POST:/repos/{owner}/{repo}/releases
     * @secure
     */
    repoCreateRelease: (owner: string, repo: string, body: CreateReleaseOption, params: RequestParams = {}) =>
      this.request<Release, APINotFound | APIError | APIValidationError>({
        path: `/repos/${owner}/${repo}/releases`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetLatestRelease
     * @summary Gets the most recent non-prerelease, non-draft release of a repository, sorted by created_at
     * @request GET:/repos/{owner}/{repo}/releases/latest
     * @secure
     */
    repoGetLatestRelease: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Release, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/latest`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetReleaseByTag
     * @summary Get a release by tag name
     * @request GET:/repos/{owner}/{repo}/releases/tags/{tag}
     * @secure
     */
    repoGetReleaseByTag: (owner: string, repo: string, tag: string, params: RequestParams = {}) =>
      this.request<Release, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/tags/${tag}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteReleaseByTag
     * @summary Delete a release by tag name
     * @request DELETE:/repos/{owner}/{repo}/releases/tags/{tag}
     * @secure
     */
    repoDeleteReleaseByTag: (owner: string, repo: string, tag: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/releases/tags/${tag}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetRelease
     * @summary Get a release
     * @request GET:/repos/{owner}/{repo}/releases/{id}
     * @secure
     */
    repoGetRelease: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Release, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteRelease
     * @summary Delete a release
     * @request DELETE:/repos/{owner}/{repo}/releases/{id}
     * @secure
     */
    repoDeleteRelease: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/releases/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditRelease
     * @summary Update a release
     * @request PATCH:/repos/{owner}/{repo}/releases/{id}
     * @secure
     */
    repoEditRelease: (owner: string, repo: string, id: number, body: EditReleaseOption, params: RequestParams = {}) =>
      this.request<Release, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListReleaseAttachments
     * @summary List release's attachments
     * @request GET:/repos/{owner}/{repo}/releases/{id}/assets
     * @secure
     */
    repoListReleaseAttachments: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<Attachment[], APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}/assets`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateReleaseAttachment
     * @summary Create a release attachment
     * @request POST:/repos/{owner}/{repo}/releases/{id}/assets
     * @secure
     */
    repoCreateReleaseAttachment: (
      owner: string,
      repo: string,
      id: number,
      data: {
        /** attachment to upload (this parameter is incompatible with `external_url`) */
        attachment?: File;
        /** url to external asset (this parameter is incompatible with `attachment`) */
        external_url?: string;
      },
      query?: {
        /** name of the attachment */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}/assets`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetReleaseAttachment
     * @summary Get a release attachment
     * @request GET:/repos/{owner}/{repo}/releases/{id}/assets/{attachment_id}
     * @secure
     */
    repoGetReleaseAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}/assets/${attachmentId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteReleaseAttachment
     * @summary Delete a release attachment
     * @request DELETE:/repos/{owner}/{repo}/releases/{id}/assets/{attachment_id}
     * @secure
     */
    repoDeleteReleaseAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}/assets/${attachmentId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditReleaseAttachment
     * @summary Edit a release attachment
     * @request PATCH:/repos/{owner}/{repo}/releases/{id}/assets/{attachment_id}
     * @secure
     */
    repoEditReleaseAttachment: (
      owner: string,
      repo: string,
      id: number,
      attachmentId: number,
      body: EditAttachmentOptions,
      params: RequestParams = {},
    ) =>
      this.request<Attachment, APINotFound>({
        path: `/repos/${owner}/${repo}/releases/${id}/assets/${attachmentId}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetReviewers
     * @summary Return all users that can be requested to review in this repo
     * @request GET:/repos/{owner}/{repo}/reviewers
     * @secure
     */
    repoGetReviewers: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/reviewers`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSigningKey
     * @summary Get signing-key.gpg for given repository
     * @request GET:/repos/{owner}/{repo}/signing-key.gpg
     * @secure
     */
    repoSigningKey: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<CommitStatusState, any>({
        path: `/repos/${owner}/${repo}/signing-key.gpg`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListStargazers
     * @summary List a repo's stargazers
     * @request GET:/repos/{owner}/{repo}/stargazers
     * @secure
     */
    repoListStargazers: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/stargazers`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListStatuses
     * @summary Get a commit's statuses
     * @request GET:/repos/{owner}/{repo}/statuses/{sha}
     * @secure
     */
    repoListStatuses: (
      owner: string,
      repo: string,
      sha: string,
      query?: {
        /** type of sort */
        sort?: 'oldest' | 'recentupdate' | 'leastupdate' | 'leastindex' | 'highestindex';
        /** type of state */
        state?: 'pending' | 'success' | 'error' | 'failure' | 'warning';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommitStatus[], APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/statuses/${sha}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateStatus
     * @summary Create a commit status
     * @request POST:/repos/{owner}/{repo}/statuses/{sha}
     * @secure
     */
    repoCreateStatus: (
      owner: string,
      repo: string,
      sha: string,
      body: CreateStatusOption,
      params: RequestParams = {},
    ) =>
      this.request<CommitStatus, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/statuses/${sha}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListSubscribers
     * @summary List a repo's watchers
     * @request GET:/repos/{owner}/{repo}/subscribers
     * @secure
     */
    repoListSubscribers: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/repos/${owner}/${repo}/subscribers`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UserCurrentCheckSubscription
     * @summary Check if the current user is watching a repo
     * @request GET:/repos/{owner}/{repo}/subscription
     * @secure
     */
    userCurrentCheckSubscription: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<WatchInfo, void>({
        path: `/repos/${owner}/${repo}/subscription`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UserCurrentPutSubscription
     * @summary Watch a repo
     * @request PUT:/repos/{owner}/{repo}/subscription
     * @secure
     */
    userCurrentPutSubscription: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<WatchInfo, APINotFound>({
        path: `/repos/${owner}/${repo}/subscription`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UserCurrentDeleteSubscription
     * @summary Unwatch a repo
     * @request DELETE:/repos/{owner}/{repo}/subscription
     * @secure
     */
    userCurrentDeleteSubscription: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/subscription`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSyncForkDefaultInfo
     * @summary Gets information about syncing the fork default branch with the base branch
     * @request GET:/repos/{owner}/{repo}/sync_fork
     * @secure
     */
    repoSyncForkDefaultInfo: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<SyncForkInfo, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/sync_fork`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSyncForkDefault
     * @summary Syncs the default branch of a fork with the base branch
     * @request POST:/repos/{owner}/{repo}/sync_fork
     * @secure
     */
    repoSyncForkDefault: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/sync_fork`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSyncForkBranchInfo
     * @summary Gets information about syncing a fork branch with the base branch
     * @request GET:/repos/{owner}/{repo}/sync_fork/{branch}
     * @secure
     */
    repoSyncForkBranchInfo: (owner: string, repo: string, branch: string, params: RequestParams = {}) =>
      this.request<SyncForkInfo, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/sync_fork/${branch}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoSyncForkBranch
     * @summary Syncs a fork branch with the base branch
     * @request POST:/repos/{owner}/{repo}/sync_fork/{branch}
     * @secure
     */
    repoSyncForkBranch: (owner: string, repo: string, branch: string, params: RequestParams = {}) =>
      this.request<any, APIError | APINotFound>({
        path: `/repos/${owner}/${repo}/sync_fork/${branch}`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListTagProtection
     * @summary List tag protections for a repository
     * @request GET:/repos/{owner}/{repo}/tag_protections
     * @secure
     */
    repoListTagProtection: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<TagProtection[], any>({
        path: `/repos/${owner}/${repo}/tag_protections`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateTagProtection
     * @summary Create a tag protections for a repository
     * @request POST:/repos/{owner}/{repo}/tag_protections
     * @secure
     */
    repoCreateTagProtection: (
      owner: string,
      repo: string,
      body: CreateTagProtectionOption,
      params: RequestParams = {},
    ) =>
      this.request<TagProtection, APIForbiddenError | APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/tag_protections`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetTagProtection
     * @summary Get a specific tag protection for the repository
     * @request GET:/repos/{owner}/{repo}/tag_protections/{id}
     * @secure
     */
    repoGetTagProtection: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<TagProtection, APINotFound>({
        path: `/repos/${owner}/${repo}/tag_protections/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteTagProtection
     * @summary Delete a specific tag protection for the repository
     * @request DELETE:/repos/{owner}/{repo}/tag_protections/{id}
     * @secure
     */
    repoDeleteTagProtection: (owner: string, repo: string, id: number, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/repos/${owner}/${repo}/tag_protections/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditTagProtection
     * @summary Edit a tag protections for a repository. Only fields that are set will be changed
     * @request PATCH:/repos/{owner}/{repo}/tag_protections/{id}
     * @secure
     */
    repoEditTagProtection: (
      owner: string,
      repo: string,
      id: number,
      body: EditTagProtectionOption,
      params: RequestParams = {},
    ) =>
      this.request<TagProtection, APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/tag_protections/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListTags
     * @summary List a repository's tags
     * @request GET:/repos/{owner}/{repo}/tags
     * @secure
     */
    repoListTags: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results, default maximum page size is 50 */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Tag[], APINotFound>({
        path: `/repos/${owner}/${repo}/tags`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateTag
     * @summary Create a new git tag in a repository
     * @request POST:/repos/{owner}/{repo}/tags
     * @secure
     */
    repoCreateTag: (owner: string, repo: string, body: CreateTagOption, params: RequestParams = {}) =>
      this.request<Tag, APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/tags`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetTag
     * @summary Get the tag of a repository by tag name
     * @request GET:/repos/{owner}/{repo}/tags/{tag}
     * @secure
     */
    repoGetTag: (owner: string, repo: string, tag: string, params: RequestParams = {}) =>
      this.request<Tag, APINotFound>({
        path: `/repos/${owner}/${repo}/tags/${tag}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteTag
     * @summary Delete a repository's tag by name
     * @request DELETE:/repos/{owner}/{repo}/tags/{tag}
     * @secure
     */
    repoDeleteTag: (owner: string, repo: string, tag: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIValidationError | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/tags/${tag}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListTeams
     * @summary List a repository's teams
     * @request GET:/repos/{owner}/{repo}/teams
     * @secure
     */
    repoListTeams: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Team[], APINotFound | APIError>({
        path: `/repos/${owner}/${repo}/teams`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCheckTeam
     * @summary Check if a team is assigned to a repository
     * @request GET:/repos/{owner}/{repo}/teams/{team}
     * @secure
     */
    repoCheckTeam: (owner: string, repo: string, team: string, params: RequestParams = {}) =>
      this.request<Team, APINotFound | APIError>({
        path: `/repos/${owner}/${repo}/teams/${team}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoAddTeam
     * @summary Add a team to a repository
     * @request PUT:/repos/{owner}/{repo}/teams/{team}
     * @secure
     */
    repoAddTeam: (owner: string, repo: string, team: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIError | APIValidationError>({
        path: `/repos/${owner}/${repo}/teams/${team}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteTeam
     * @summary Delete a team from a repository
     * @request DELETE:/repos/{owner}/{repo}/teams/{team}
     * @secure
     */
    repoDeleteTeam: (owner: string, repo: string, team: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIError | APIValidationError>({
        path: `/repos/${owner}/${repo}/teams/${team}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoTrackedTimes
     * @summary List a repo's tracked times
     * @request GET:/repos/{owner}/{repo}/times
     * @secure
     */
    repoTrackedTimes: (
      owner: string,
      repo: string,
      query?: {
        /** optional filter by user (available for issue managers) */
        user?: string;
        /**
         * Only show times updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show times updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TrackedTime[], APIError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/times`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name UserTrackedTimes
     * @summary List a user's tracked times in a repo
     * @request GET:/repos/{owner}/{repo}/times/{user}
     * @deprecated
     * @secure
     */
    userTrackedTimes: (owner: string, repo: string, user: string, params: RequestParams = {}) =>
      this.request<TrackedTime[], APIError | APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/times/${user}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoListTopics
     * @summary Get list of topics that a repository has
     * @request GET:/repos/{owner}/{repo}/topics
     * @secure
     */
    repoListTopics: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TopicName, APINotFound>({
        path: `/repos/${owner}/${repo}/topics`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoUpdateTopics
     * @summary Replace list of topics for a repository
     * @request PUT:/repos/{owner}/{repo}/topics
     * @secure
     */
    repoUpdateTopics: (owner: string, repo: string, body: RepoTopicOptions, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIInvalidTopicsError>({
        path: `/repos/${owner}/${repo}/topics`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoAddTopic
     * @summary Add a topic to a repository
     * @request PUT:/repos/{owner}/{repo}/topics/{topic}
     * @secure
     */
    repoAddTopic: (owner: string, repo: string, topic: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIInvalidTopicsError>({
        path: `/repos/${owner}/${repo}/topics/${topic}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteTopic
     * @summary Delete a topic from a repository
     * @request DELETE:/repos/{owner}/{repo}/topics/{topic}
     * @secure
     */
    repoDeleteTopic: (owner: string, repo: string, topic: string, params: RequestParams = {}) =>
      this.request<any, APINotFound | APIInvalidTopicsError>({
        path: `/repos/${owner}/${repo}/topics/${topic}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoTransfer
     * @summary Transfer a repo ownership
     * @request POST:/repos/{owner}/{repo}/transfer
     * @secure
     */
    repoTransfer: (owner: string, repo: string, body: TransferRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | APIValidationError>({
        path: `/repos/${owner}/${repo}/transfer`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name AcceptRepoTransfer
     * @summary Accept a repo transfer
     * @request POST:/repos/{owner}/{repo}/transfer/accept
     * @secure
     */
    acceptRepoTransfer: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/transfer/accept`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RejectRepoTransfer
     * @summary Reject a repo transfer
     * @request POST:/repos/{owner}/{repo}/transfer/reject
     * @secure
     */
    rejectRepoTransfer: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound>({
        path: `/repos/${owner}/${repo}/transfer/reject`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoCreateWikiPage
     * @summary Create a wiki page
     * @request POST:/repos/{owner}/{repo}/wiki/new
     * @secure
     */
    repoCreateWikiPage: (owner: string, repo: string, body: CreateWikiPageOptions, params: RequestParams = {}) =>
      this.request<WikiPage, APIError | APIForbiddenError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/wiki/new`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetWikiPage
     * @summary Get a wiki page
     * @request GET:/repos/{owner}/{repo}/wiki/page/{pageName}
     * @secure
     */
    repoGetWikiPage: (owner: string, repo: string, pageName: string, params: RequestParams = {}) =>
      this.request<WikiPage, APINotFound>({
        path: `/repos/${owner}/${repo}/wiki/page/${pageName}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoDeleteWikiPage
     * @summary Delete a wiki page
     * @request DELETE:/repos/{owner}/{repo}/wiki/page/{pageName}
     * @secure
     */
    repoDeleteWikiPage: (owner: string, repo: string, pageName: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/wiki/page/${pageName}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoEditWikiPage
     * @summary Edit a wiki page
     * @request PATCH:/repos/{owner}/{repo}/wiki/page/{pageName}
     * @secure
     */
    repoEditWikiPage: (
      owner: string,
      repo: string,
      pageName: string,
      body: CreateWikiPageOptions,
      params: RequestParams = {},
    ) =>
      this.request<WikiPage, APIError | APIForbiddenError | APINotFound | APIRepoArchivedError>({
        path: `/repos/${owner}/${repo}/wiki/page/${pageName}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetWikiPages
     * @summary Get all wiki pages
     * @request GET:/repos/{owner}/{repo}/wiki/pages
     * @secure
     */
    repoGetWikiPages: (
      owner: string,
      repo: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<WikiPageMetaData[], APINotFound>({
        path: `/repos/${owner}/${repo}/wiki/pages`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name RepoGetWikiPageRevisions
     * @summary Get revisions of a wiki page
     * @request GET:/repos/{owner}/{repo}/wiki/revisions/{pageName}
     * @secure
     */
    repoGetWikiPageRevisions: (
      owner: string,
      repo: string,
      pageName: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<WikiCommitList, APINotFound>({
        path: `/repos/${owner}/${repo}/wiki/revisions/${pageName}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository
     * @name GenerateRepo
     * @summary Create a repository using a template
     * @request POST:/repos/{template_owner}/{template_repo}/generate
     * @secure
     */
    generateRepo: (templateOwner: string, templateRepo: string, body: GenerateRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIForbiddenError | APINotFound | void | APIValidationError>({
        path: `/repos/${templateOwner}/${templateRepo}/generate`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  repositories = {
    /**
     * No description
     *
     * @tags repository
     * @name RepoGetById
     * @summary Get a repository by id
     * @request GET:/repositories/{id}
     * @secure
     */
    repoGetById: (id: number, params: RequestParams = {}) =>
      this.request<Repository, APINotFound>({
        path: `/repositories/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  settings = {
    /**
     * No description
     *
     * @tags settings
     * @name GetGeneralApiSettings
     * @summary Get instance's global settings for api
     * @request GET:/settings/api
     * @secure
     */
    getGeneralApiSettings: (params: RequestParams = {}) =>
      this.request<GeneralAPISettings, any>({
        path: `/settings/api`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags settings
     * @name GetGeneralAttachmentSettings
     * @summary Get instance's global settings for Attachment
     * @request GET:/settings/attachment
     * @secure
     */
    getGeneralAttachmentSettings: (params: RequestParams = {}) =>
      this.request<GeneralAttachmentSettings, any>({
        path: `/settings/attachment`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags settings
     * @name GetGeneralRepositorySettings
     * @summary Get instance's global settings for repositories
     * @request GET:/settings/repository
     * @secure
     */
    getGeneralRepositorySettings: (params: RequestParams = {}) =>
      this.request<GeneralRepoSettings, any>({
        path: `/settings/repository`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags settings
     * @name GetGeneralUiSettings
     * @summary Get instance's global settings for ui
     * @request GET:/settings/ui
     * @secure
     */
    getGeneralUiSettings: (params: RequestParams = {}) =>
      this.request<GeneralUISettings, any>({
        path: `/settings/ui`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  signingKeyGpg = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetSigningKey
     * @summary Get default signing-key.gpg
     * @request GET:/signing-key.gpg
     * @secure
     */
    getSigningKey: (params: RequestParams = {}) =>
      this.request<CommitStatusState, any>({
        path: `/signing-key.gpg`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  signingKeySsh = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetSshSigningKey
     * @summary Get default signing-key.ssh
     * @request GET:/signing-key.ssh
     * @secure
     */
    getSshSigningKey: (params: RequestParams = {}) =>
      this.request<CommitStatusState, APINotFound>({
        path: `/signing-key.ssh`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  teams = {
    /**
     * No description
     *
     * @tags organization
     * @name OrgGetTeam
     * @summary Get a team
     * @request GET:/teams/{id}
     * @secure
     */
    orgGetTeam: (id: number, params: RequestParams = {}) =>
      this.request<Team, APINotFound>({
        path: `/teams/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgDeleteTeam
     * @summary Delete a team
     * @request DELETE:/teams/{id}
     * @secure
     */
    orgDeleteTeam: (id: number, params: RequestParams = {}) =>
      this.request<void, APINotFound>({
        path: `/teams/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgEditTeam
     * @summary Edit a team
     * @request PATCH:/teams/{id}
     * @secure
     */
    orgEditTeam: (id: number, body: EditTeamOption, params: RequestParams = {}) =>
      this.request<Team, APINotFound>({
        path: `/teams/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeamActivityFeeds
     * @summary List a team's activity feeds
     * @request GET:/teams/{id}/activities/feeds
     * @secure
     */
    orgListTeamActivityFeeds: (
      id: number,
      query?: {
        /**
         * the date of the activities to be found
         * @format date
         */
        date?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Activity[], APINotFound>({
        path: `/teams/${id}/activities/feeds`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeamMembers
     * @summary List a team's members
     * @request GET:/teams/{id}/members
     * @secure
     */
    orgListTeamMembers: (
      id: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/teams/${id}/members`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeamMember
     * @summary List a particular member of team
     * @request GET:/teams/{id}/members/{username}
     * @secure
     */
    orgListTeamMember: (id: number, username: string, params: RequestParams = {}) =>
      this.request<User, APINotFound>({
        path: `/teams/${id}/members/${username}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgAddTeamMember
     * @summary Add a team member
     * @request PUT:/teams/{id}/members/{username}
     * @secure
     */
    orgAddTeamMember: (id: number, username: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/teams/${id}/members/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgRemoveTeamMember
     * @summary Remove a team member
     * @request DELETE:/teams/{id}/members/{username}
     * @secure
     */
    orgRemoveTeamMember: (id: number, username: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/teams/${id}/members/${username}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeamRepos
     * @summary List a team's repos
     * @request GET:/teams/{id}/repos
     * @secure
     */
    orgListTeamRepos: (
      id: number,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/teams/${id}/repos`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListTeamRepo
     * @summary List a particular repo of team
     * @request GET:/teams/{id}/repos/{org}/{repo}
     * @secure
     */
    orgListTeamRepo: (id: number, org: string, repo: string, params: RequestParams = {}) =>
      this.request<Repository, APINotFound>({
        path: `/teams/${id}/repos/${org}/${repo}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgAddTeamRepository
     * @summary Add a repository to a team
     * @request PUT:/teams/{id}/repos/{org}/{repo}
     * @secure
     */
    orgAddTeamRepository: (id: number, org: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/teams/${id}/repos/${org}/${repo}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description This does not delete the repository, it only removes the repository from the team.
     *
     * @tags organization
     * @name OrgRemoveTeamRepository
     * @summary Remove a repository from a team
     * @request DELETE:/teams/{id}/repos/{org}/{repo}
     * @secure
     */
    orgRemoveTeamRepository: (id: number, org: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound>({
        path: `/teams/${id}/repos/${org}/${repo}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  topics = {
    /**
     * No description
     *
     * @tags repository
     * @name TopicSearch
     * @summary Search for topics by keyword
     * @request GET:/topics/search
     * @secure
     */
    topicSearch: (
      query: {
        /** keyword to search for */
        q: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          topics?: TopicResponse[];
        },
        APIForbiddenError | APINotFound
      >({
        path: `/topics/search`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserGetCurrent
     * @summary Get the authenticated user
     * @request GET:/user
     * @secure
     */
    userGetCurrent: (params: RequestParams = {}) =>
      this.request<User, APIUnauthorizedError | APIForbiddenError>({
        path: `/user`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserRunners
     * @summary Get the user's runners
     * @request GET:/user/actions/runners
     * @secure
     */
    getUserRunners: (
      query?: {
        /** whether to include all visible runners (true) or only those that are directly owned by the user (false) */
        visible?: boolean;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunner[], APIError | APIUnauthorizedError | APINotFound>({
        path: `/user/actions/runners`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name RegisterUserRunner
     * @summary Register a new user-level runner
     * @request POST:/user/actions/runners
     * @secure
     */
    registerUserRunner: (body: RegisterRunnerOptions, params: RequestParams = {}) =>
      this.request<RegisterRunnerResponse, APIError | APIUnauthorizedError | APINotFound>({
        path: `/user/actions/runners`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserSearchRunJobs
     * @summary Search for user's action jobs according filter conditions
     * @request GET:/user/actions/runners/jobs
     * @secure
     */
    userSearchRunJobs: (
      query?: {
        /** a comma separated list of run job labels to search for */
        labels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionRunJob[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/actions/runners/jobs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description This operation has been deprecated in Forgejo 15. Use the web UI or [`/user/actions/runners`](#/user/registerUserRunner) instead.
     *
     * @tags user
     * @name UserGetRunnerRegistrationToken
     * @summary Get the user's runner registration token
     * @request GET:/user/actions/runners/registration-token
     * @deprecated
     * @secure
     */
    userGetRunnerRegistrationToken: (params: RequestParams = {}) =>
      this.request<RegistrationToken, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/actions/runners/registration-token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserRunner
     * @summary Get a particular runner that belongs to the user
     * @request GET:/user/actions/runners/{runner_id}
     * @secure
     */
    getUserRunner: (runnerId: string, params: RequestParams = {}) =>
      this.request<ActionRunner, APIError | APIUnauthorizedError | APINotFound>({
        path: `/user/actions/runners/${runnerId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name DeleteUserRunner
     * @summary Delete a particular user-level runner
     * @request DELETE:/user/actions/runners/{runner_id}
     * @secure
     */
    deleteUserRunner: (runnerId: string, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APINotFound>({
        path: `/user/actions/runners/${runnerId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UpdateUserSecret
     * @summary Create or Update a secret value in a user scope
     * @request PUT:/user/actions/secrets/{secretname}
     * @secure
     */
    updateUserSecret: (secretname: string, body: CreateOrUpdateSecretOption, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/secrets/${secretname}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name DeleteUserSecret
     * @summary Delete a secret in a user scope
     * @request DELETE:/user/actions/secrets/{secretname}
     * @secure
     */
    deleteUserSecret: (secretname: string, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/secrets/${secretname}`,
        method: 'DELETE',
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserVariablesList
     * @summary Get the user-level list of variables which is created by current doer
     * @request GET:/user/actions/variables
     * @secure
     */
    getUserVariablesList: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActionVariable[], APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/variables`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserVariable
     * @summary Get a user-level variable which is created by current doer
     * @request GET:/user/actions/variables/{variablename}
     * @secure
     */
    getUserVariable: (variablename: string, params: RequestParams = {}) =>
      this.request<ActionVariable, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/variables/${variablename}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UpdateUserVariable
     * @summary Update a user-level variable which is created by current doer
     * @request PUT:/user/actions/variables/{variablename}
     * @secure
     */
    updateUserVariable: (variablename: string, body: UpdateVariableOption, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/variables/${variablename}`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name CreateUserVariable
     * @summary Create a user-level variable
     * @request POST:/user/actions/variables/{variablename}
     * @secure
     */
    createUserVariable: (variablename: string, body: CreateVariableOption, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/variables/${variablename}`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name DeleteUserVariable
     * @summary Delete a user-level variable which is created by current doer
     * @request DELETE:/user/actions/variables/{variablename}
     * @secure
     */
    deleteUserVariable: (variablename: string, params: RequestParams = {}) =>
      this.request<void, APIError | APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/actions/variables/${variablename}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentActivityPubFollow
     * @summary Follow a remote activitypub account
     * @request POST:/user/activitypub/follow
     * @secure
     */
    userCurrentActivityPubFollow: (body: APRemoteFollowOption, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/activitypub/follow`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetOAuth2Applications
     * @summary List the authenticated user's oauth2 applications
     * @request GET:/user/applications/oauth2
     * @secure
     */
    userGetOAuth2Applications: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<OAuth2Application[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/applications/oauth2`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreateOAuth2Application
     * @summary Creates a new OAuth2 application
     * @request POST:/user/applications/oauth2
     * @secure
     */
    userCreateOAuth2Application: (body: CreateOAuth2ApplicationOptions, params: RequestParams = {}) =>
      this.request<OAuth2Application, APIError | APIUnauthorizedError | APIForbiddenError>({
        path: `/user/applications/oauth2`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetOAuth2Application
     * @summary Get an OAuth2 application
     * @request GET:/user/applications/oauth2/{id}
     * @secure
     */
    userGetOAuth2Application: (id: number, params: RequestParams = {}) =>
      this.request<OAuth2Application, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/applications/oauth2/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDeleteOAuth2Application
     * @summary Delete an OAuth2 application
     * @request DELETE:/user/applications/oauth2/{id}
     * @secure
     */
    userDeleteOAuth2Application: (id: number, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/applications/oauth2/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdateOAuth2Application
     * @summary Update an OAuth2 application, this includes regenerating the client secret
     * @request PATCH:/user/applications/oauth2/{id}
     * @secure
     */
    userUpdateOAuth2Application: (id: number, body: CreateOAuth2ApplicationOptions, params: RequestParams = {}) =>
      this.request<OAuth2Application, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/applications/oauth2/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdateAvatar
     * @summary Update avatar of the current user
     * @request POST:/user/avatar
     * @secure
     */
    userUpdateAvatar: (body: UpdateUserAvatarOption, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/avatar`,
        method: 'POST',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDeleteAvatar
     * @summary Delete avatar of the current user. It will be replaced by a default one
     * @request DELETE:/user/avatar
     * @secure
     */
    userDeleteAvatar: (params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/avatar`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserBlockUser
     * @summary Blocks a user from the doer
     * @request PUT:/user/block/{username}
     * @secure
     */
    userBlockUser: (username: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/user/block/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListEmails
     * @summary List all email addresses of the current user
     * @request GET:/user/emails
     * @secure
     */
    userListEmails: (params: RequestParams = {}) =>
      this.request<Email[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/emails`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserAddEmail
     * @summary Add an email addresses to the current user's account
     * @request POST:/user/emails
     * @secure
     */
    userAddEmail: (body: CreateEmailOption, params: RequestParams = {}) =>
      this.request<Email[], APIUnauthorizedError | APIForbiddenError | APIValidationError>({
        path: `/user/emails`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDeleteEmail
     * @summary Delete email addresses from the current user's account
     * @request DELETE:/user/emails
     * @secure
     */
    userDeleteEmail: (body: DeleteEmailOption, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/emails`,
        method: 'DELETE',
        body: body,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListFollowers
     * @summary List the authenticated user's followers
     * @request GET:/user/followers
     * @secure
     */
    userCurrentListFollowers: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/followers`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListFollowing
     * @summary List the users that the authenticated user is following
     * @request GET:/user/following
     * @secure
     */
    userCurrentListFollowing: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/following`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentCheckFollowing
     * @summary Check whether a user is followed by the authenticated user
     * @request GET:/user/following/{username}
     * @secure
     */
    userCurrentCheckFollowing: (username: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/following/${username}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentPutFollow
     * @summary Follow a user
     * @request PUT:/user/following/{username}
     * @secure
     */
    userCurrentPutFollow: (username: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/following/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentDeleteFollow
     * @summary Unfollow a user
     * @request DELETE:/user/following/{username}
     * @secure
     */
    userCurrentDeleteFollow: (username: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/following/${username}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetVerificationToken
     * @summary Get a Token to verify
     * @request GET:/user/gpg_key_token
     * @secure
     */
    getVerificationToken: (params: RequestParams = {}) =>
      this.request<string, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/gpg_key_token`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserVerifyGpgKey
     * @summary Verify a GPG key
     * @request POST:/user/gpg_key_verify
     * @secure
     */
    userVerifyGpgKey: (body: VerifyGPGKeyOption, params: RequestParams = {}) =>
      this.request<GPGKey, APIUnauthorizedError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/user/gpg_key_verify`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListGpgKeys
     * @summary List the authenticated user's GPG keys
     * @request GET:/user/gpg_keys
     * @secure
     */
    userCurrentListGpgKeys: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GPGKey[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/gpg_keys`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentPostGpgKey
     * @summary Add a GPG public key to current user's account
     * @request POST:/user/gpg_keys
     * @secure
     */
    userCurrentPostGpgKey: (Form: CreateGPGKeyOption, params: RequestParams = {}) =>
      this.request<GPGKey, APIUnauthorizedError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/user/gpg_keys`,
        method: 'POST',
        body: Form,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentGetGpgKey
     * @summary Get a GPG key
     * @request GET:/user/gpg_keys/{id}
     * @secure
     */
    userCurrentGetGpgKey: (id: number, params: RequestParams = {}) =>
      this.request<GPGKey, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/gpg_keys/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentDeleteGpgKey
     * @summary Remove a GPG public key from current user's account
     * @request DELETE:/user/gpg_keys/{id}
     * @secure
     */
    userCurrentDeleteGpgKey: (id: number, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/gpg_keys/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListHooks
     * @summary List the authenticated user's webhooks
     * @request GET:/user/hooks
     * @secure
     */
    userListHooks: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Hook[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/hooks`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreateHook
     * @summary Create a hook
     * @request POST:/user/hooks
     * @secure
     */
    userCreateHook: (body: CreateHookOption, params: RequestParams = {}) =>
      this.request<Hook, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/hooks`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetHook
     * @summary Get a hook
     * @request GET:/user/hooks/{id}
     * @secure
     */
    userGetHook: (id: number, params: RequestParams = {}) =>
      this.request<Hook, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/hooks/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDeleteHook
     * @summary Delete a hook
     * @request DELETE:/user/hooks/{id}
     * @secure
     */
    userDeleteHook: (id: number, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/hooks/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserEditHook
     * @summary Update a hook
     * @request PATCH:/user/hooks/{id}
     * @secure
     */
    userEditHook: (id: number, body: EditHookOption, params: RequestParams = {}) =>
      this.request<Hook, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/hooks/${id}`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListKeys
     * @summary List the authenticated user's public keys
     * @request GET:/user/keys
     * @secure
     */
    userCurrentListKeys: (
      query?: {
        /** fingerprint of the key */
        fingerprint?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicKey[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/keys`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentPostKey
     * @summary Create a public key
     * @request POST:/user/keys
     * @secure
     */
    userCurrentPostKey: (body: CreateKeyOption, params: RequestParams = {}) =>
      this.request<PublicKey, APIUnauthorizedError | APIForbiddenError | APIValidationError>({
        path: `/user/keys`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentGetKey
     * @summary Get a public key
     * @request GET:/user/keys/{id}
     * @secure
     */
    userCurrentGetKey: (id: number, params: RequestParams = {}) =>
      this.request<PublicKey, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/keys/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentDeleteKey
     * @summary Delete a public key
     * @request DELETE:/user/keys/{id}
     * @secure
     */
    userCurrentDeleteKey: (id: number, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/keys/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListBlockedUsers
     * @summary List the authenticated user's blocked users
     * @request GET:/user/list_blocked
     * @secure
     */
    userListBlockedUsers: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BlockedUser[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/list_blocked`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListCurrentUserOrgs
     * @summary List the current user's organizations
     * @request GET:/user/orgs
     * @secure
     */
    orgListCurrentUserOrgs: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Organization[], APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/orgs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetQuota
     * @summary Get quota information for the authenticated user
     * @request GET:/user/quota
     * @secure
     */
    userGetQuota: (params: RequestParams = {}) =>
      this.request<QuotaInfo, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/quota`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListQuotaArtifacts
     * @summary List the artifacts affecting the authenticated user's quota
     * @request GET:/user/quota/artifacts
     * @secure
     */
    userListQuotaArtifacts: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedArtifactList, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/quota/artifacts`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListQuotaAttachments
     * @summary List the attachments affecting the authenticated user's quota
     * @request GET:/user/quota/attachments
     * @secure
     */
    userListQuotaAttachments: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedAttachmentList, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/quota/attachments`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCheckQuota
     * @summary Check if the authenticated user is over quota for a given subject
     * @request GET:/user/quota/check
     * @secure
     */
    userCheckQuota: (
      query: {
        /** subject of the quota */
        subject: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<boolean, APIUnauthorizedError | APIForbiddenError | APIValidationError>({
        path: `/user/quota/check`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListQuotaPackages
     * @summary List the packages affecting the authenticated user's quota
     * @request GET:/user/quota/packages
     * @secure
     */
    userListQuotaPackages: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuotaUsedPackageList, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/quota/packages`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListRepos
     * @summary List the repos that the authenticated user owns
     * @request GET:/user/repos
     * @secure
     */
    userCurrentListRepos: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /** order the repositories */
        order_by?:
          | 'name'
          | 'id'
          | 'newest'
          | 'oldest'
          | 'recentupdate'
          | 'leastupdate'
          | 'reversealphabetically'
          | 'alphabetically'
          | 'reversesize'
          | 'size'
          | 'reversegitsize'
          | 'gitsize'
          | 'reverselfssize'
          | 'lfssize'
          | 'moststars'
          | 'feweststars'
          | 'mostforks'
          | 'fewestforks';
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APIUnauthorizedError | APIForbiddenError | APIValidationError>({
        path: `/user/repos`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags repository, user
     * @name CreateCurrentUserRepo
     * @summary Create a repository
     * @request POST:/user/repos
     * @secure
     */
    createCurrentUserRepo: (body: CreateRepoOption, params: RequestParams = {}) =>
      this.request<Repository, APIError | APIUnauthorizedError | APIForbiddenError | void | APIValidationError>({
        path: `/user/repos`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserSettings
     * @summary Get current user's account settings
     * @request GET:/user/settings
     * @secure
     */
    getUserSettings: (params: RequestParams = {}) =>
      this.request<UserSettings, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/settings`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UpdateUserSettings
     * @summary Update settings in current user's account
     * @request PATCH:/user/settings
     * @secure
     */
    updateUserSettings: (body: UserSettingsOptions, params: RequestParams = {}) =>
      this.request<UserSettings, APIUnauthorizedError | APIForbiddenError>({
        path: `/user/settings`,
        method: 'PATCH',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListStarred
     * @summary The repos that the authenticated user has starred
     * @request GET:/user/starred
     * @secure
     */
    userCurrentListStarred: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/starred`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentCheckStarring
     * @summary Whether the authenticated is starring the repo
     * @request GET:/user/starred/{owner}/{repo}
     * @secure
     */
    userCurrentCheckStarring: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/starred/${owner}/${repo}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentPutStar
     * @summary Star the given repo
     * @request PUT:/user/starred/{owner}/{repo}
     * @secure
     */
    userCurrentPutStar: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/starred/${owner}/${repo}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentDeleteStar
     * @summary Unstar the given repo
     * @request DELETE:/user/starred/{owner}/{repo}
     * @secure
     */
    userCurrentDeleteStar: (owner: string, repo: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound>({
        path: `/user/starred/${owner}/${repo}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetStopWatches
     * @summary Get list of all existing stopwatches
     * @request GET:/user/stopwatches
     * @secure
     */
    userGetStopWatches: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<StopWatch[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/stopwatches`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentListSubscriptions
     * @summary List repositories watched by the authenticated user
     * @request GET:/user/subscriptions
     * @secure
     */
    userCurrentListSubscriptions: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/subscriptions`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListTeams
     * @summary List all the teams a user belongs to
     * @request GET:/user/teams
     * @secure
     */
    userListTeams: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Team[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/teams`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCurrentTrackedTimes
     * @summary List the current user's tracked times
     * @request GET:/user/times
     * @secure
     */
    userCurrentTrackedTimes: (
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
        /**
         * Only show times updated after the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        since?: string;
        /**
         * Only show times updated before the given time. This is a timestamp in RFC 3339 format
         * @format date-time
         */
        before?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TrackedTime[], APIUnauthorizedError | APIForbiddenError>({
        path: `/user/times`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUnblockUser
     * @summary Unblocks a user from the doer
     * @request PUT:/user/unblock/{username}
     * @secure
     */
    userUnblockUser: (username: string, params: RequestParams = {}) =>
      this.request<any, APIUnauthorizedError | APIForbiddenError | APINotFound | APIValidationError>({
        path: `/user/unblock/${username}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags user
     * @name UserSearch
     * @summary Search for users
     * @request GET:/users/search
     * @secure
     */
    userSearch: (
      query?: {
        /** keyword */
        q?: string;
        /**
         * ID of the user to search for
         * @format int64
         */
        uid?: number;
        /** sort order of results */
        sort?: 'oldest' | 'newest' | 'alphabetically' | 'reversealphabetically' | 'recentupdate' | 'leastupdate';
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: User[];
          ok?: boolean;
        },
        any
      >({
        path: `/users/search`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGet
     * @summary Get a user
     * @request GET:/users/{username}
     * @secure
     */
    userGet: (username: string, params: RequestParams = {}) =>
      this.request<User, APINotFound>({
        path: `/users/${username}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListActivityFeeds
     * @summary List a user's activity feeds
     * @request GET:/users/{username}/activities/feeds
     * @secure
     */
    userListActivityFeeds: (
      username: string,
      query?: {
        /** if true, only show actions performed by the requested user */
        'only-performed-by'?: boolean;
        /**
         * the date of the activities to be found
         * @format date
         */
        date?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Activity[], APINotFound>({
        path: `/users/${username}/activities/feeds`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListFollowers
     * @summary List the given user's followers
     * @request GET:/users/{username}/followers
     * @secure
     */
    userListFollowers: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/users/${username}/followers`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListFollowing
     * @summary List the users that the given user is following
     * @request GET:/users/{username}/following
     * @secure
     */
    userListFollowing: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<User[], APINotFound>({
        path: `/users/${username}/following`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCheckFollowing
     * @summary Check if one user is following another user
     * @request GET:/users/{username}/following/{target}
     * @secure
     */
    userCheckFollowing: (username: string, target: string, params: RequestParams = {}) =>
      this.request<any, APINotFound>({
        path: `/users/${username}/following/${target}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListGpgKeys
     * @summary List the given user's GPG keys
     * @request GET:/users/{username}/gpg_keys
     * @secure
     */
    userListGpgKeys: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GPGKey[], APINotFound>({
        path: `/users/${username}/gpg_keys`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetHeatmapData
     * @summary Get a user's heatmap
     * @request GET:/users/{username}/heatmap
     * @secure
     */
    userGetHeatmapData: (username: string, params: RequestParams = {}) =>
      this.request<UserHeatmapData, APINotFound>({
        path: `/users/${username}/heatmap`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListKeys
     * @summary List the given user's public keys
     * @request GET:/users/{username}/keys
     * @secure
     */
    userListKeys: (
      username: string,
      query?: {
        /** fingerprint of the key */
        fingerprint?: string;
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicKey[], APINotFound>({
        path: `/users/${username}/keys`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgListUserOrgs
     * @summary List a user's organizations
     * @request GET:/users/{username}/orgs
     * @secure
     */
    orgListUserOrgs: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Organization[], APINotFound>({
        path: `/users/${username}/orgs`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrgGetUserPermissions
     * @summary Get user permissions in organization
     * @request GET:/users/{username}/orgs/{org}/permissions
     * @secure
     */
    orgGetUserPermissions: (username: string, org: string, params: RequestParams = {}) =>
      this.request<OrganizationPermissions, APIForbiddenError | APINotFound>({
        path: `/users/${username}/orgs/${org}/permissions`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListRepos
     * @summary List the repos owned by the given user
     * @request GET:/users/{username}/repos
     * @secure
     */
    userListRepos: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/users/${username}/repos`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListStarred
     * @summary The repos that the given user has starred
     * @request GET:/users/{username}/starred
     * @secure
     */
    userListStarred: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/users/${username}/starred`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserListSubscriptions
     * @summary List the repositories watched by a user
     * @request GET:/users/{username}/subscriptions
     * @secure
     */
    userListSubscriptions: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Repository[], APINotFound>({
        path: `/users/${username}/subscriptions`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetTokens
     * @summary List the specified user's access tokens
     * @request GET:/users/{username}/tokens
     * @secure
     */
    userGetTokens: (
      username: string,
      query?: {
        /** page number of results to return (1-based) */
        page?: number;
        /** page size of results */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AccessToken[], APIForbiddenError | APINotFound>({
        path: `/users/${username}/tokens`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreateToken
     * @summary Generate an access token for the specified user
     * @request POST:/users/{username}/tokens
     * @secure
     */
    userCreateToken: (username: string, body: CreateAccessTokenOption, params: RequestParams = {}) =>
      this.request<AccessToken, APIError | APIForbiddenError | APINotFound>({
        path: `/users/${username}/tokens`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDeleteAccessToken
     * @summary Delete an access token from the specified user's account
     * @request DELETE:/users/{username}/tokens/{token}
     * @secure
     */
    userDeleteAccessToken: (username: string, token: string, params: RequestParams = {}) =>
      this.request<any, APIForbiddenError | APINotFound | APIError>({
        path: `/users/${username}/tokens/${token}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  version = {
    /**
     * No description
     *
     * @tags miscellaneous
     * @name GetVersion
     * @summary Returns the version of the running application
     * @request GET:/version
     * @secure
     */
    getVersion: (params: RequestParams = {}) =>
      this.request<ServerVersion, any>({
        path: `/version`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
}
