import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { init, socketInit } from 'actions/connection.action';
import { open as drawerOpen, toggle as drawerToggle } from 'actions/drawer.action';
import { downloadStorageResults, getCaching, getKubernetesLogsData } from 'actions/jobs.action';
import {
  execRawPipeline,
  pausePipeline,
  rerunRawPipeline,
  resumePipeline,
  stopPipeline,
  cronStart,
  cronStop,
  deleteStored,
  updateStored,
  execStored,
} from 'actions/pipeline.action';
import { changeStep, triggerUserGuide } from 'actions/userGuide.action';
import { firstLoad, toggle as toggleViewType } from 'actions/viewType.action';

const actions = {
  applyAlgorithm,
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
  firstLoad,
  getCaching,
  getKubernetesLogsData,
  init,
  pausePipeline,
  rerunRawPipeline,
  resumePipeline,
  socketInit,
  stopPipeline,
  toggleViewType,
  triggerUserGuide,
  updateStored,
};

export default actions;
