import AT from 'const/application-actions';
import io from 'socket.io-client';
import { COLOR } from 'styles/colors';
import { setConnectionStatus } from 'actions/connection.action';

let socket = null;
const currentTopicRegistered = {};

const success = (dispatch, payload, action) => {
  dispatch({
    type: action.payload.actionType,
    meta: action.meta,
    payload,
  });
};

const changeConnectionStatus = (dispatch, { isSocketConnected }) =>
  dispatch(setConnectionStatus({ isSocketConnected }));

const connectionsEvents = {
  CONNECTION: 'connect',
  RECONNECT: 'reconnect',
};

const connectLog = () =>
  console.log(
    `%cSOCKET Connected, id=${socket.id}`,
    `background: ${COLOR.grey}; color: ${COLOR.blue}`,
  );

const noConnectionEvents = [
  'disconnect',
  'connect_error',
  'connect_timeout',
  'error',
  'reconnect_attempt',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed',
];

let isSocketConnected = false;

const socketMiddleware = ({ dispatch }) => next => action => {
  if (action.type === `${AT.SOCKET_GET_CONFIG}_SUCCESS`) {
    if (socket) {
      socket.close();
    }

    const { monitorBackend } = action.payload.config;

    const url = monitorBackend.useLocation
      ? location.origin // eslint-disable-line
      : `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}`;

    socket = io(url, {
      path: monitorBackend.socketIoPath,
      transports: ['websocket'],
    });

    Object.values(connectionsEvents).forEach(event => {
      socket.on(event, args => {
        event === connectionsEvents.CONNECTION ? connectLog() : console.info(`${event}, ${args}`);
        isSocketConnected = true;
        changeConnectionStatus(dispatch, { isSocketConnected });
      });
    });

    noConnectionEvents.forEach(e =>
      socket.on(e, args => {
        console.info(`${e}, ${args}`);
        isSocketConnected = false;
        changeConnectionStatus(dispatch, { isSocketConnected });
      }),
    );

    Object.keys(currentTopicRegistered).forEach(act =>
      socket.on(currentTopicRegistered[act].payload.topic, data => {
        if (data && !isSocketConnected) {
          isSocketConnected = true;
          changeConnectionStatus(dispatch, { isSocketConnected });
        }
        success(dispatch, data, currentTopicRegistered[act]);
      }),
    );
  }
  if (action.type === AT.SOCKET_INIT) {
    // verify if topic is already  registered in-order to prevent duplicate registration
    if (Object.keys(currentTopicRegistered).includes(action.payload.topic)) {
      console.warn(`socket middleware: trying to register topic ${action.payload.topic} twice `);
    } else {
      if (socket !== null) {
        socket.on(action.payload.topic, data => success(dispatch, data, action));
      }
      currentTopicRegistered[action.payload.topic] = action;
    }
  }

  return next(action);
};

export default socketMiddleware;
