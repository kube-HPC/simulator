import successMsg from 'config/schema/success-messages.schema';
import AT from 'const/application-actions';
import { forceRefetchAll } from 'graphql/usePolling';
import client from './../client';
import actions from '../actions';

const API_URL = '/api/v1';

const setMonitorPath = monitorBackend => {
  const port = monitorBackend.port === '80' ? '' : `:${monitorBackend.port}`;
  return monitorBackend.useLocation
    ? `${window.location.origin}${monitorBackend.path}${API_URL}`
    : `${monitorBackend.schema}${monitorBackend.host}${port}${monitorBackend.path}${API_URL}`;
  // : `${monitorBackend.schema}${monitorBackend.host}${monitorBackend.path}${API_URL}`;
};

const setDatasourcesPath = monitorBackend => {
  const port = monitorBackend.port === '80' ? '' : `:${monitorBackend.port}`;

  monitorBackend.useLocation
    ? `${window.location.origin}${monitorBackend.datasourcesPath}${API_URL}`
    : `${monitorBackend.schema}${monitorBackend.host}${port}${monitorBackend.datasourcesPath}${API_URL}`;
};

const setBoardPath = board =>
  board.useLocation
    ? `${window.location.origin}${board.path}`
    : `${board.schema}${board.host}:${board.port}${board.path}`;
// : `${board.schema}${board.host}${board.path}`;

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
      ...action.meta,
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
  action.meta?.onSuccess?.(payload);
  dispatch({
    type: `${action.payload.actionType}_SUCCESS`,
    meta: {
      ...action.meta,
      message: {
        type: 'success',
        content: successMessage[action.payload.actionType],
      },
    },
    payload,
  });
};

let SOCKET_URL = null;
let SOCKET_DATASOURCES_URL = null;
let BOARD_URL = null;

const restMiddleware =
  ({ dispatch }) =>
  next =>
  action => {
    if (action.type === `${AT.SOCKET_GET_CONFIG}_SUCCESS`) {
      const {
        monitorBackend,
        board,
        hkubeSystemVersion,
        kibanaUrl,
        structuredPrefix,
        grafanaUrl,
        grafanaDashboardUrl,
        dataSourceIsEnable,
        keycloakEnable,
        checkIframe,
      } = action.payload.config;
      SOCKET_URL = setMonitorPath(monitorBackend);
      SOCKET_DATASOURCES_URL = setDatasourcesPath(monitorBackend);
      BOARD_URL = setBoardPath(board);
      dispatch(
        actions.connectionSetup({
          socketUrl: SOCKET_URL,
          socketDatasourcesUrl: SOCKET_DATASOURCES_URL,
          boardUrl: BOARD_URL,
          hkubeSystemVersion,
          kibanaUrl,
          structuredPrefix,
          grafanaUrl,
          grafanaDashboardUrl,
          dataSourceIsEnable,
          keycloakEnable,
          checkIframe,
        })
      );
      client.defaults.baseURL = SOCKET_URL;
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
      client
        .get(action.payload.url)
        .then(res => success(dispatch, res.data, action))
        .catch(err => {
          const response =
            err.response && err.response.data && err.response.data.error;
          reject(dispatch, response, action);
        });
    } else if (action.type === AT.REST_REQ_POST) {
      client
        .post(action.payload.url, action.payload.body)
        .then(res => {
          success(dispatch, res.data, action);

          forceRefetchAll();
        })
        .catch(err => reject(dispatch, err.response.data.error, action));
    } else if (action.type === AT.REST_REQ_POST_FORM) {
      client
        .post(action.payload.url, action.payload.formData)
        .then(res => {
          success(dispatch, res.data, action);
          forceRefetchAll();
        })
        .catch(err => reject(dispatch, err.response.data.error, action));
    } else if (action.type === AT.REST_REQ_PUT) {
      client
        .put(action.payload.url, action.payload.body)
        .then(res => {
          success(dispatch, res.data, action);

          forceRefetchAll();
        })
        .catch(err => reject(dispatch, err.response.data.error, action));
    } else if (action.type === AT.REST_REQ_DELETE) {
      client
        .delete(action.payload.url, { data: action.payload.body })
        .then(res => {
          success(dispatch, res.data, action);

          forceRefetchAll();
        })
        .catch(err => reject(dispatch, err?.response?.data?.error, action));
    }

    return next(action);
  };

export default restMiddleware;
