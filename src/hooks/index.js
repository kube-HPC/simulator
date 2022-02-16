import useDataSourceSnapshots from './dataSources/useSnapshots';
import useDataSources from './dataSources/useDataSources';
import useDataSourceVersions from './dataSources/useVersions';

export { default as useActions } from './useActions';
export { default as useAlgorithm } from './useAlgorithm';
export { default as useBoards } from './useBoards';
export { default as useConnectionStatus } from './useConnectionStatus';
export { default as useDrawer } from './useDrawer';
export { default as useDrawerEditor } from './useDrawerEditor.react';
export { default as useErrorLogs } from './useErrorLogs';
export { default as useStorage } from './useStorage';
export { default as useExperiments } from './useExperiments';
export { default as useFilters } from './useFilters';
export { default as useJobs } from './useJobs';
export { default as useLeftSidebar } from './useLeftSidebar.react';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useLogs } from './useLogs';
export { default as useNodeInfo } from './useNodeInfo';
export { default as usePipeline } from './usePipeline';
export { default as useReadme } from './useReadme';
export { default as useSettings } from './useSettings';
export { default as useStats } from './useStats';
export { default as useTraceData } from './useTraceData';
export { default as useVersions } from './useVersions';
export { default as useSiteThemeMode } from './useSiteThemeMode.react';
export { default as useWizardAddPipeline } from './useWizardAddPipeline';
export { default as useWizard } from './useWizard';

export const dataSources = {
  useSnapshots: useDataSourceSnapshots,
  useVersions: useDataSourceVersions,
  useDataSources,
};
