import AT from '../constants/actions';
import axios from 'axios';
import FileSaver from 'file-saver';

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
  const isShowMessageSuccess = {
    EXEC_STORED_PIPE: 'Stored pipeline execution started, check Jobs table',
    UPDATE_STORED_PIPELINE: 'Pipeline updated',
    DELETE_STORED_PIPE: 'Pipeline deleted',
    EXEC_RAW_PIPELINE: 'Raw pipeline execution started',
    ADD_PIPE: `Pipeline ${payload.name} has been stored`,
    ALGORITHM_APPLY: 'Algorithm Added',
    ALGORITHM_ADD: 'Algorithm Added for debug',
    CRON_START: 'Cron job started for selected pipeline',
    CRON_STOP: 'Cron job disabled for selected pipeline',
    BUILD_STOP: 'Build has stopped',
    BUILD_RERUN: 'Build rerun started'
  };
  dispatch({
    type: `${action.payload.actionType}_SUCCESS`,
    meta: {
      message: {
        type: 'success', // 'success/error/warning'
        content: isShowMessageSuccess[action.payload.actionType]
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
  if (action.type === `${AT.GET_CONFIG}_SUCCESS`) {
    url = setPath(action.payload.config);
  } else if (
    ![
      AT.REST_REQ,
      AT.REST_REQ_POST,
      AT.REST_REQ_POST_FORM,
      AT.REST_REQ_PUT,
      AT.REST_REQ_DELETE,
      AT.DOWNLOAD_REQ
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
  } else if (action.type === AT.DOWNLOAD_REQ) {
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
