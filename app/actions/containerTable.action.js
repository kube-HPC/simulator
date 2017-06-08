import actions from '../constants/actions';
import topics from '../constants/topics';


export const init = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: topics.PODS_DATA,
    actionType: actions.UPDATE_ROW_DATA_TABLE
  }
});
