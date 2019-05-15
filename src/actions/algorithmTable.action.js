import actions from '../constants/actions';
import topics from '../constants/topics';

export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PROGRESS,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});

export const applyAlgorithm = formData => ({
  type: actions.REST_REQ_POST_FORM,
  payload: {
    url: 'store/algorithms/apply',
    formData,
    actionType: actions.ALGORITHM_APPLY
  }
});

export const deleteAlgorithmFromStore = algorithmName => ({
  type: actions.REST_REQ_DELETE,
  payload: {
    url: 'store/algorithms',
    body: { algorithmName },
    actionType: actions.ALGORITHM_STORE_REMOVE
  }
});
