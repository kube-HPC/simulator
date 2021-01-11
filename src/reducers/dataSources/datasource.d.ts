export type FetchStatus = 'SUCCESS' | 'PENDING' | 'FAIL' | 'IDLE';

export type FileMeta = {
  id: string;
  name: string;
  /** The file's location in the repository */
  path: string;
  /** Size in bytes */
  size: number;
  /** Mime type */
  type: string;
  /** An extra text content the user can upload per file */
  meta?: string;
  uploadedAt: number;
};

export type DataSourceEntry = {
  id?: string;
  name: string;
  files: FileMeta[];
  versionDescription: string;
};

export type DataSourceMeta = {
  id: string;
  name: string;
  versionDescription: string;
  filesCount: number;
  avgFileSize: string;
  totalSize: number;
  fileTypes: string[];
  versionId: string;
};

export type DataSourceVersion = {
  versionDescription: string;
  versionId: string;
  id: string;
};

export type DataSource = DataSourceMeta &
  DataSourceEntry & { status?: FetchStatus };
