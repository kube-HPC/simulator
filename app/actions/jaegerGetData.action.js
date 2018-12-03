import actions from '../constants/actions';

export const getData = (jobId) => ({
  type: actions.REST_REQ,
  payload: {
    url: `/jaeger?jobId=${jobId}`,
    actionType: actions.JAEGER_REST
  }
});

