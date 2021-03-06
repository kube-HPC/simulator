import io from 'socket.io-client';
import { setConnectionStatus } from 'actions/connection.action';
import AT from 'const/application-actions';
import { COLOR } from 'styles/colors';
import { getExperimentName } from 'hooks/useExperiments';

const currentTopicRegistered = {};

const success = (payload, action) => ({
  type: action.payload.actionType,
  meta: action.meta,
  payload,
});

const changeConnectionStatus = isSocketConnected =>
  setConnectionStatus({ isSocketConnected });

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
  console.info(
    `connecting to socket room: ${name}, previous room: ${lastRoom}`
  );
  socket.emit(connectionsEvents.EXPERIMENT_REGISTER, {
    name,
    lastRoom,
  });
  console.info(
    `%cSOCKET Connected, id=${socket.id}`,
    `background: ${COLOR.grey}; color: ${COLOR.blue}`
  );
};

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

const socketMiddleware = ({ dispatch }) => {
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

      Object.values(connectionsEvents).forEach(event => {
        socket.on(event, args => {
          console.info(
            args
              ? `initializing socket event: ${event}, with args: ${JSON.stringify(
                  args
                )}`
              : `initializing socket event: ${event}, with no args`
          );

          if (
            [
              connectionsEvents.CONNECTION,
              connectionsEvents.EXPERIMENT_REGISTER,
            ].includes(event)
          ) {
            const experimentName = getExperimentName(window.location.search);
            const { name, lastRoom } = toSocketRoom(experimentName);
            connectOperation({ socket, name, lastRoom });
          } else {
            console.info(`${event}, ${args}`);
          }
          dispatch(changeConnectionStatus(socket.connected));
        });
      });

      noConnectionEvents.forEach(event => {
        socket.on(event, args => {
          console.info(`${event}, ${args}`);
          dispatch(changeConnectionStatus(socket.connected));
        });
      });

      Object.keys(currentTopicRegistered).forEach(act =>
        socket.on(currentTopicRegistered[act].payload.topic, data => {
          const isSocketConnected = socket.connected;
          if (data && !isSocketConnected) {
            dispatch(changeConnectionStatus(isSocketConnected));
          }
          dispatch(success(data, currentTopicRegistered[act]));
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
            dispatch(success(data, action))
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
