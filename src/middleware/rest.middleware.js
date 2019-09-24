import AT from 'const/application-actions';
import axios from 'axios';
import FileSaver from 'file-saver';
import successMsg from 'config/schema/success-messages.schema';

const setPath = ({ monitorBackend }) =>
  monitorBackend.useLocation
    ? `${location.origin}${monitorBackend.path}` // eslint-disable-line
    : `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}${monitorBackend.path}`;

const reject = (dispatch, payload, action) => {
  dispatch({
    type: `${action.payload.actionType}_REJECT`,
    meta: {
      message: {
        type: 'error',
        content: _formatError(payload)
      }
    },
    payload
  });
};

const pending = (dispatch, payload, action) => {
  dispatch({
    type: `${action.payload.actionType}_PENDING`,
    meta: action.meta,
    payload
  });
};

const success = (dispatch, payload, action) => {
  const successMessage = successMsg(payload);
  dispatch({
    type: `${action.payload.actionType}_SUCCESS`,
    meta: {
      message: {
        type: 'success',
        content: successMessage[action.payload.actionType]
      }
    },
    payload
  });
};

const _formatError = payload => {
  if (!payload) return DEFAULT_ERROR_MSG;
  return typeof payload === 'string' ? payload : payload.message || DEFAULT_ERROR_MSG;
};

const DEFAULT_ERROR_MSG = 'Unexpected Error';
let SOCKET_URL = null;

const restMiddleware = ({ dispatch }) => next => action => {
  if (action.type === `${AT.SOCKET_GET_CONFIG}_SUCCESS`) {
    SOCKET_URL = setPath(action.payload.config);
    SOCKET_URL && dispatch({ type: AT.SOCKET_SET_URL, url: SOCKET_URL });
  } else if (
    ![
      AT.REST_REQ,
      AT.REST_REQ_POST,
      AT.REST_REQ_POST_FORM,
      AT.REST_REQ_PUT,
      AT.REST_REQ_DELETE,
      AT.JOBS_DOWNLOAD_REQ
    ].includes(action.type)
  ) {
    return next(action);
  } else if (action.type === AT.REST_REQ) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .get(`${SOCKET_URL}${action.payload.url}`)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        const response = err.response && err.response.data && err.response.data.error;
        reject(dispatch, response, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_POST) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .post(`${SOCKET_URL}/${action.payload.url}`, action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_POST_FORM) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .post(`${SOCKET_URL}/${action.payload.url}`, action.payload.formData)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_PUT) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .put(`${SOCKET_URL}/${action.payload.url}`, action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_DELETE) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .delete(`${SOCKET_URL}/${action.payload.url}/${action.payload.body.algorithmName}`, {
        data: action.payload.body
      })
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.JOBS_DOWNLOAD_REQ) {
    if (!SOCKET_URL) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .get(`${SOCKET_URL}${action.payload.url}`, {
        responseType: 'blob',
        timeout: 30000
      })
      .then(res => {
        FileSaver.saveAs(res.data, 'results.json');
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  }
};

export default restMiddleware;
