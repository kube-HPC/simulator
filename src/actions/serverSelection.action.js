import actions from '../constants/actions';

export const init = () => ({
  type: actions.REST_REQ,
  payload: {
    actionType: actions.GET_CONFIG,
    url: 'config'
  }
});

export const updateConnectionServer = () => ({
  type: actions.UPDATE_SERVER_CONNECTION,
  payload: {
    currentSelection: {
      url: `${location.protocol}//${location.hostname}:30010`, //eslint-disable-line
      path: ''
    }
  }
});
