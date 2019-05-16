import AT from '../constants/actions';
import io from 'socket.io-client';

let socket = null;
const currentTopicRegisterd = {};

const success = (dispatch, payload, action) => {
  dispatch({
    type: action.payload.actionType,
    meta: action.meta,
    payload
  });
};

export const socketioMiddleware = ({ dispatch }) => next => action => {
  if (![AT.SEND_TERMINAL_INPUT, AT.SOCKET_INIT, `${AT.GET_CONFIG}_SUCCESS`].includes(action.type)) {
    return next(action);
  }
  if (action.type === `${AT.GET_CONFIG}_SUCCESS`) {
    if (socket) {
      socket.close();
    }
    const { monitorBackend } = action.payload.config;
    let url;
    if (monitorBackend.useLocation) {
      url = location.origin; //eslint-disable-line
    } else {
      url = `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}`;
    }
    // const url = `${location.protocol}//${location.hostname}:30010`;
    socket = io(url, {
      path: monitorBackend.socketIoPath,
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log(`connected... ${socket.id}`);
    });

    const events = ['connect_error', 'connect_timeout', 'error', 'reconnect', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed']
    events.forEach((e) => {
      socket.on(e, (args) => {
        console.log(`${e}, ${args}`);
      });
    })

    Object.keys(currentTopicRegisterd).forEach(act => {
      socket.on(currentTopicRegisterd[act].payload.topic, data => {
        success(dispatch, data, currentTopicRegisterd[act]);
      });
    });
  }
  if (action.type === AT.SOCKET_INIT) {
    // verify if topic is already  registerd inorder to prevent duplicate registretion
    if (!Object.keys(currentTopicRegisterd).includes(action.payload.topic)) {
      if (socket != null) {
        socket.on(action.payload.topic, data => {
          success(dispatch, data, action);
        });
      }
      currentTopicRegisterd[action.payload.topic] = action;
    } else {
      console.warn(`socket middlware: trying to register topic ${action.payload.topic} twice `);
    }
  } else {
    setTimeout(() => {
      socket.emit(action.payload.topic, action.payload.data);
    }, 300);
  }
  return next(action);
};
