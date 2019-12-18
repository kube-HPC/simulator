import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { init, socketInit } from 'actions/connection.action';
import { open as drawerOpen, toggle as drawerToggle } from 'actions/drawer.action';
import { downloadStorageResults, getKubernetesLogsData, getCaching } from 'actions/jobs.action';
import { execRawPipeline, rerunRawPipeline, stopPipeline } from 'actions/pipeline.action';
import { changeStep, triggerUserGuide } from 'actions/userGuide.action';
import { toggle as toggleViewType } from 'actions/viewType.action';

const actions = {
  applyAlgorithm,
  changeStep,
  deleteAlgorithm,
  downloadStorageResults,
  drawerOpen,
  drawerToggle,
  execRawPipeline,
  init,
  rerunRawPipeline,
  socketInit,
  stopPipeline,
  toggleViewType,
  triggerUserGuide,
  getKubernetesLogsData,
  getCaching,
};

export default actions;
