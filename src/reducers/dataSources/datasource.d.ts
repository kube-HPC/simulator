export type DataSourceMeta = {
  name: string;
  id: string;
  path: string;
};

export type fileMeta = {
  path: string;
  size: number;
  mtime: string;
};

export type DataSource = DataSourceMeta & {
  files: fileMeta[];
};
