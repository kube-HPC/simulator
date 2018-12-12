import actions from '../constants/actions';
import topics from '../constants/topics';


export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});

export const addAlgorithm = (algorithmName) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `debug/add`,
    body: { algorithmName },
    actionType: actions.ALGORITHM_ADD
  }
});
export const deleteAlgorithm = (algorithmName) => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: `debug/delete`,
    body: { algorithmName },
    actionType: actions.ALGORITHM_DELETE
  }
});
