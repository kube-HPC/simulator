export type ImageAlgorithm = {
  name: string;
  algorithmImage: string;
  cpu: number;
  mem: string;
  options: {
    debug: boolean;
    pending: boolean;
    devMode: boolean;
  };
  algorithmEnv?: {
    storage_env: 's3' | 'fs';
    cm_env: {
      configMapKeyRef: {
        name: string;
        key: string;
      };
    };
  };
  minHotWorkers: number;
  type: 'Image';
  reservedMemory?: string;
  version?: string;
};

type CodeAlgorithm = {
  name: string;
  mem: string;
  cpu: number;
  env: 'nodejs';
  type: 'Code';
  options: {
    debug: boolean;
    pending: boolean;
    devMode: boolean;
  };
  minHotWorkers: number;
  fileInfo: {
    fileExt: 'zip' | 'gz';
    checksum: string;
    fileSize: number;
    path: string;
  };
};

type GitAlgorithm = {
  name: string;
  gitRepository: {
    url: string;
    token?: string;
    branchName: string;
    gitKind: 'github';
    webUrl: string;
    cloneUrl: string;
    commit: {
      id: string;
      timestamp: string;
      message: string;
    };
  };
  env: 'nodejs';
  type: 'Git';
  cpu: number;
  mem: string;
  options: {
    debug: boolean;
    pending: boolean;
    devMode: boolean;
  };
  minHotWorkers: number;
};
export type Algorithm = ImageAlgorithm | GitAlgorithm | CodeAlgorithm;
