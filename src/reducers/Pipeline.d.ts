export type Pipeline = {
  flowInput?: {
    files: { link: string }[];
  };
  name: string;
  nodes: {
    nodeName: string;
    algorithmName: string;
    input: string[];
  }[];
  options?: {
    batchTolerance: number;
    progressVerbosityLevel: 'debug';
  };
};

export type Stats = {
  name: string;
  stats: any[];
};
