import actions from '../constants/actions';
import topics from '../constants/topics';


export const init = () => ({
  type: actions.REST_REQ,
  payload: {
    actionType: actions.GET_CONFIG,
    url:'/config'
  }
});


export const updateConnectionServer = (data) => ({
  type: actions.UPDATE_SERVER_CONNECTION,
  payload: {
    currentSelection:data    
  }
});