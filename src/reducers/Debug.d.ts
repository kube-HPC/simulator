export type Debug = {
  cpu: number;
  created: number;
  data: { path: string };
  mem: string;
  minHotWorkers: number;
  modified: number;
  name: string;
  options: { debug: boolean; pending: boolean };
  type: string;
};
