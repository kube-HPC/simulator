import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { cancelBuild, rerunBuild } from 'actions/builds.action';
import { init, socketInit } from 'actions/connection.action';
import { open as drawerOpen, toggle as drawerToggle } from 'actions/drawer.action';
import { filterByType } from 'actions/filter.action';
import { downloadStorageResults, getCaching, getKubernetesLogsData } from 'actions/jobs.action';
import {
  addPipeline,
  cronStart,
  cronStop,
  deleteStored,
  execRawPipeline,
  execStored,
  pausePipeline,
  rerunRawPipeline,
  resumePipeline,
  stopPipeline,
  updateStored,
} from 'actions/pipeline.action';
import { setSettings } from 'actions/settings.action';
import { startBoard } from 'actions/tensorflow.action';
import { changeStep, triggerUserGuide } from 'actions/userGuide.action';
import { firstLoad, toggle as toggleViewType } from 'actions/viewType.action';

const actions = {
  addPipeline,
  applyAlgorithm,
  cancelBuild,
  changeStep,
  cronStart,
  cronStop,
  deleteAlgorithm,
  deleteStored,
  downloadStorageResults,
  drawerOpen,
  drawerToggle,
  execRawPipeline,
  execStored,
  filterByType,
  firstLoad,
  getCaching,
  getKubernetesLogsData,
  init,
  pausePipeline,
  rerunBuild,
  rerunRawPipeline,
  resumePipeline,
  setSettings,
  socketInit,
  startBoard,
  stopPipeline,
  toggleViewType,
  triggerUserGuide,
  updateStored,
};

export default actions;
