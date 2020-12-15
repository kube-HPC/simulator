export type FetchStatus = 'SUCCESS' | 'PENDING' | 'FAIL' | 'IDLE';

export type FileMeta = {
  path: string;
  size: number;
  mtime: string;
  type: string;
};

export type DataSourceEntry = {
  id?: Id;
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
};

export type DataSourceVersion = {
  versionDescription: string;
  versionId: string;
  id: string;
};

export type DataSource = DataSourceMeta &
  DataSourceEntry & { status?: FetchStatus };
