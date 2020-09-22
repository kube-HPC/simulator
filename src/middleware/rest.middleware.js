import axios from 'axios';
import successMsg from 'config/schema/success-messages.schema';
import AT from 'const/application-actions';

const setMonitorPath = monitorBackend =>
  monitorBackend.useLocation
    ? `${window.location.origin}${monitorBackend.path}`
    : `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}${monitorBackend.path}`;

const setBoardPath = board =>
  board.useLocation
    ? `${window.location.origin}${board.path}`
    : `${board.schema}${board.host}:${board.port}${board.path}`;

const DEFAULT_ERROR_MSG = 'Unexpected Error';

const _formatError = payload => {
  if (!payload) {
    return DEFAULT_ERROR_MSG;
  }
  return typeof payload === 'string'
    ? payload
    : payload.message || DEFAULT_ERROR_MSG;
};

const ignoreActions = [AT.README_GET_ALGORITHM, AT.README_GET_PIPELINE];

const _ignoreError = actionType => ignoreActions.includes(actionType);

const reject = (dispatch, payload, action) => {
  if (_ignoreError(action.payload.actionType)) {
    return;
  }

  dispatch({
    type: `${action.payload.actionType}_REJECT`,
    meta: {
      message: {
        type: 'error',
        content: _formatError(payload),
      },
    },
    payload,
  });
};

const pending = (dispatch, payload, action) => {
  dispatch({
    type: `${action.payload.actionType}_PENDING`,
    meta: action.meta,
    payload,
  });
};

const success = (dispatch, payload, action) => {
  const successMessage = successMsg({ ...payload, ...action.payload });
  dispatch({
    type: `${action.payload.actionType}_SUCCESS`,
    meta: {
      message: {
        type: 'success',
        content: successMessage[action.payload.actionType],
      },
    },
    payload,
  });
};

let SOCKET_URL = null;
let BOARD_URL = null;

const createUrl = url => `${SOCKET_URL}/${url}`;

const restMiddleware = ({ dispatch }) => next => action => {
  if (action.type === `${AT.SOCKET_GET_CONFIG}_SUCCESS`) {
    const { monitorBackend, board, hkubeSystemVersion } = action.payload.config;
    SOCKET_URL = setMonitorPath(monitorBackend);
    BOARD_URL = setBoardPath(board);
    if (SOCKET_URL) dispatch({ type: AT.SOCKET_SET_URL, url: SOCKET_URL });
    dispatch({ type: AT.BOARD_SET_URL, url: BOARD_URL });
    dispatch({
      type: AT.SET_HKUBE_VERSION,
      hkubeSystemVersion: hkubeSystemVersion || null,
    });
    return next(action);
  }
  if (
    ![
      AT.REST_REQ_GET,
      AT.REST_REQ_POST,
      AT.REST_REQ_POST_FORM,
      AT.REST_REQ_PUT,
      AT.REST_REQ_DELETE,
    ].includes(action.type)
  ) {
    return next(action);
  }

  if (!SOCKET_URL) return next(action);

  pending(dispatch, 'pending', action);
  if (action.type === AT.REST_REQ_GET) {
    axios
      .get(createUrl(action.payload.url))
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        const response =
          err.response && err.response.data && err.response.data.error;
        reject(dispatch, response, action);
      });
  } else if (action.type === AT.REST_REQ_POST) {
    axios
      .post(createUrl(action.payload.url), action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });
  } else if (action.type === AT.REST_REQ_POST_FORM) {
    axios
      .post(createUrl(action.payload.url), action.payload.formData)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });
  } else if (action.type === AT.REST_REQ_PUT) {
    axios
      .put(createUrl(action.payload.url), action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });
  } else if (action.type === AT.REST_REQ_DELETE) {
    axios
      .delete(createUrl(action.payload.url), {
        data: action.payload.body,
      })
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });
  }
  return next(action);
};

export default restMiddleware;
