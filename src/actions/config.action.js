import actions from '../constants/actions';

export const init = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    actionType: actions.GET_CONFIG,
    url: 'config'
  }
});
