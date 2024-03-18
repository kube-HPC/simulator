import {
  applyAlgorithm,
  deleteAlgorithm,
  runAlgorithm,
} from './algorithm.action';
import { filterData } from './autoComplete.action';
import { cancelBuild, rerunBuild } from './builds.action';
import {
  init,
  socketInit,
  setConnectionStatus,
  connectionSetup,
} from './connection.action';
import { open as drawerOpen, toggle as drawerToggle } from './drawer.action';
import {
  addExperiment,
  deleteExperiment,
  setExperimentLoading,
  changeExperiment,
} from './experiments.action';
import { filterByType } from './filter.action';
import { getCaching, getKubernetesLogsData } from './jobs.action';
import {
  addPipeline,
  cronStart,
  cronStop,
  deleteStored,
  execRawPipeline,
  execStored,
  pausePipeline,
  resumePipeline,
  stopPipeline,
  stopAllPipeline,
  updateStored,
} from './pipeline.action';
import { setSettings } from './settings.action';
import { startBoard } from './tensorflow.action';
import { changeStep, triggerUserGuide } from './userGuide.action';
import { firstLoad, toggle as toggleViewType } from './viewType.action';
import {
  fetchDataSources,
  fetchDataSourceVersions,
  fetchDataSource,
  retryFetchDataSource,
  retryFetchDataSources,
  fetchSnapshots,
  createDataSource,
  deleteDataSource,
  postVersion as postDataSourceVersion,
} from './dataSources';

const actions = {
  addExperiment,
  addPipeline,
  applyAlgorithm,
  cancelBuild,
  changeExperiment,
  changeStep,
  cronStart,
  cronStop,
  deleteAlgorithm,
  deleteExperiment,
  deleteStored,
  drawerOpen,
  drawerToggle,
  execRawPipeline,
  execStored,
  filterByType,
  filterData,
  firstLoad,
  getCaching,
  getKubernetesLogsData,
  init,
  pausePipeline,
  rerunBuild,
  resumePipeline,
  runAlgorithm,
  setSettings,
  socketInit,
  startBoard,
  stopPipeline,
  stopAllPipeline,
  toggleViewType,
  setExperimentLoading,
  triggerUserGuide,
  updateStored,
  setConnectionStatus,
  connectionSetup,
  fetchDataSources,
  retryFetchDataSources,
  deleteDataSource,
  fetchDataSourceVersions,
  fetchDataSource,
  retryFetchDataSource,
  fetchSnapshots,
  createDataSource,
  postDataSourceVersion,
};

export default actions;
