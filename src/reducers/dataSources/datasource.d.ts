export type fileMeta = {
  path: string;
  size: number;
  mtime: string;
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

export type DataSource = DataSourceMeta & DataSourceEntry;
