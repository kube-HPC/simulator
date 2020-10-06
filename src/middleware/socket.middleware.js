import io from 'socket.io-client';
import { setConnectionStatus } from 'actions/connection.action';
import AT from 'const/application-actions';
import { COLOR } from 'styles/colors';

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
  EXPERIMENT_REGISTER: 'experiment-register',
};

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

const connectOperation = ({ socket, name, lastRoom }) => {
  socket.emit(connectionsEvents.EXPERIMENT_REGISTER, { name, lastRoom });
  console.info(
    `%cSOCKET Connected, id=${socket.id}`,
    `background: ${COLOR.grey}; color: ${COLOR.blue}`
  );
};

let isSocketConnected = false;

const toSocketRoom = value => (value ? `experiment:${value}` : null);

// this value is used for un-subscribing the previous experiment
let lastExperimentId = null;
const getSocketRoom = experimentId => {
  const response = {
    name: toSocketRoom(experimentId),
    lastRoom: toSocketRoom(lastExperimentId),
  };

  lastExperimentId = experimentId;
  return response;
};

const socketMiddleware = ({ dispatch, getState }) => {
  let socket = null;
  return next => action => {
    if (action.type === `${AT.SOCKET_GET_CONFIG}_SUCCESS`) {
      if (socket) socket.close();

      const { monitorBackend } = action.payload.config;

      const url = monitorBackend.useLocation
        ? window.location.origin
        : `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}`;

      socket = io(url, {
        path: monitorBackend.socketIoPath,
        transports: ['websocket'],
      });

      const emitOptions = getSocketRoom(getState);

      Object.values(connectionsEvents).forEach(event => {
        socket.on(event, args => {
          [
            connectionsEvents.CONNECTION,
            connectionsEvents.EXPERIMENT_REGISTER,
          ].includes(event)
            ? connectOperation({
                socket,
                ...emitOptions,
              })
            : console.info(`${event}, ${args}`);

          changeConnectionStatus(dispatch, { isSocketConnected });
        });
      });

      noConnectionEvents.forEach(e =>
        socket.on(e, args => {
          console.info(`${e}, ${args}`);
          isSocketConnected = false;
          changeConnectionStatus(dispatch, { isSocketConnected });
        })
      );

      Object.keys(currentTopicRegistered).forEach(act =>
        socket.on(currentTopicRegistered[act].payload.topic, data => {
          if (data && !isSocketConnected) {
            isSocketConnected = true;
            changeConnectionStatus(dispatch, { isSocketConnected });
          }
          success(dispatch, data, currentTopicRegistered[act]);
        })
      );
    }
    if (action.type === AT.SOCKET_INIT) {
      // verify if topic is already  registered in-order to prevent duplicate registration
      if (Object.keys(currentTopicRegistered).includes(action.payload.topic)) {
        console.warn(
          `socket middleware: trying to register topic ${action.payload.topic} twice`
        );
      } else {
        if (socket !== null) {
          socket.on(action.payload.topic, data =>
            success(dispatch, data, action)
          );
        }
        currentTopicRegistered[action.payload.topic] = action;
      }
    }

    if (action.type === AT.EXPERIMENT_CHANGE) {
      const { name, lastRoom } = getSocketRoom(action.payload);
      connectOperation({ socket, name, lastRoom });
    }

    return next(action);
  };
};

export default socketMiddleware;
