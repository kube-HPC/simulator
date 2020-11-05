import { handleActions } from 'redux-actions';
import { actionType } from 'const';

const initialState = {
  baseUrl: '',
  hasConfig: false,
};

export const config = handleActions(
  {
    [`${actionType.SOCKET_GET_CONFIG}_SUCCESS`]: (state, { payload }) => ({
      ...state,
      baseUrl: payload.config.baseUrl,
      hasConfig: true,
    }),
  },
  initialState
);
