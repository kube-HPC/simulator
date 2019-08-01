import AT from 'constants/application-actions';
import axios from 'axios';
import FileSaver from 'file-saver';
import successMsg from 'config/schema/success-messages.schema';

let url = null;

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

const _formatError = payload =>
  typeof payload === 'string' ? payload : payload.message || 'Error';

const setPath = ({ monitorBackend }) => {
  let _url;
  if (monitorBackend.useLocation) {
    _url = `${location.origin}${monitorBackend.path}`; //eslint-disable-line
  } else {
    _url = `${monitorBackend.schema}${monitorBackend.host}:${
      monitorBackend.port
    }${monitorBackend.path}`;
  }

  return _url;
};

const restMiddleware = ({ dispatch }) => next => action => {
  if (action.type === `${AT.LAYOUT_GET_CONFIG}_SUCCESS`) {
    url = setPath(action.payload.config);
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
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .get(`${url}${action.payload.url}`)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        const response =
          err.response && err.response.data && err.response.data.error;
        reject(dispatch, response, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_POST) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .post(`${url}/${action.payload.url}`, action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_POST_FORM) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .post(`${url}/${action.payload.url}`, action.payload.formData)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_PUT) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .put(`${url}/${action.payload.url}`, action.payload.body)
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.REST_REQ_DELETE) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .delete(
        `${url}/${action.payload.url}/${action.payload.body.algorithmName}`,
        {
          data: action.payload.body
        }
      )
      .then(res => {
        success(dispatch, res.data, action);
      })
      .catch(err => {
        reject(dispatch, err.response.data.error, action);
      });

    return next(action);
  } else if (action.type === AT.JOBS_DOWNLOAD_REQ) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios
      .get(`${url}${action.payload.url}`, {
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
