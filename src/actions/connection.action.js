import actions from 'const/application-actions';
import TOPICS from 'const/topics';

const DEFAULT_URL = 'dashboard-config.json';

export const socketInit = () => ({
  type: actions.SOCKET_INIT,
  payload: {
    topic: TOPICS.PROGRESS,
    actionType: actions.SOCKET_GET_DATA,
  },
});

export const initDashboardConfig = () => ({
  type: actions.REST_REQ_CONFIG,
  payload: {
    url: DEFAULT_URL,
    actionType: actions.SOCKET_GET_CONFIG,
  },
});

export const connectionSetup = ({
  socketUrl,
  socketDatasourcesUrl,
  boardUrl,
  hkubeSystemVersion,
  kibanaUrl,
  structuredPrefix,
  grafanaUrl,
  grafanaDashboardUrl,
  dataSourceIsEnable,
  keycloakEnable,
}) => ({
  type: actions.CONNECTION_SETUP,
  payload: {
    socketUrl,
    socketDatasourcesUrl,
    boardUrl,
    hkubeSystemVersion,
    kibanaUrl,
    structuredPrefix,
    grafanaUrl,
    grafanaDashboardUrl,
    dataSourceIsEnable,
    keycloakEnable,
  },
});

export const setConnectionStatus = ({ isSocketConnected }) => ({
  type: actions.CONNECTION_STATUS_CHANGE,
  payload: { isSocketConnected },
});
