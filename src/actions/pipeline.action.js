import actions from 'const/application-actions';

export const addPipeline = pipeline => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `store/pipelines`,
    body: pipeline,
    actionType: actions.PIPELINE_ADD,
  },
});

export const stopAllPipeline = (pipelineName, { onSuccess }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/stop`,
    body: {
      pipelineName,
      reason: `Request from simulator, Algorithms-tab Delete action`,
    },
    actionType: actions.PIPELINE_STOP,
  },
  meta: { pipelineName, onSuccess },
});

export const stopPipeline = jobId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/stop`,
    body: {
      jobId,
      reason: `Request from simulator, Algorithms-tab Delete action`,
    },
    actionType: actions.PIPELINE_STOP,
  },
});

export const pausePipeline = jobId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/pause`,
    body: { jobId },
    actionType: actions.PIPELINE_PAUSE,
  },
});

export const resumePipeline = jobId => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/resume`,
    body: { jobId },
    actionType: actions.PIPELINE_RESUME,
  },
});

export const execStored = pipeline => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/stored`,
    body: pipeline,
    actionType: actions.PIPELINE_START,
  },
});

export const deleteStored = pipelineName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `store/pipelines/${pipelineName}`,
    actionType: actions.PIPELINE_DELETE,
  },
});

export const updateStored = pipeline => ({
  type: actions.REST_REQ_PUT,
  payload: {
    url: `store/pipelines`,
    body: pipeline,
    actionType: actions.PIPELINE_UPDATE,
  },
});

export const cronStart = (name, pattern, onSuccess) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `cron/start`,
    body: { name, pattern },
    actionType: actions.PIPELINE_CRON_START,
  },
  meta: { onSuccess },
});

export const cronStop = (name, pattern, onSuccess) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `cron/stop`,
    body: { name, pattern },
    actionType: actions.PIPELINE_CRON_STOP,
  },
  meta: { onSuccess },
});

export const execRawPipeline = pipeline => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `exec/raw`,
    body: pipeline,
    actionType: actions.PIPELINE_START,
  },
});
