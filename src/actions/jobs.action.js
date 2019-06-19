import actions from 'constants/actions';

export const getJaegerData = jobId => ({
  type: actions.REST_REQ,
  payload: {
    url: `/jaeger?jobId=${jobId}`,
    actionType: actions.JAEGER_REST
  }
});

export const downloadStorageResults = path => ({
  type: actions.DOWNLOAD_REQ,
  payload: {
    url: `/download/results?path=${path}`,
    actionType: actions.DOWNLOAD_RESULTS
  }
});
