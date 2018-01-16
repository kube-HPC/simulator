import AT from '../constants/actions';
import io from 'socket.io-client';
import topics from '../constants/topics';
// const API_URL = `${window.location.origin}/api`;
const API_URL = 'http://localhost:8091/';
// const API_URL = 'http://101.150.4.70:8080';


let connected = false;

// let socket = io(API_URL,{path:'/api/v1/proxy/namespaces/default/services/worker-statistics-server/socket.io'});
// fetch('/config').then((res)=>{
//   res.json().then((data)=>{
//     console.log(data)
//   })

// }).catch(()=>{
//   console.error('ddd')
// })
// let socket = io(API_URL, { transports: ['websocket'] });
let socket = null;
const currentTopicRegisterd = {};

const success = (dispatch, payload, action) => {
    dispatch({
        type: action.payload.actionType,
        meta: action.meta,
        payload
    });
};

export const socketioMiddleware = ({ dispatch }) => (next) => (action) => {
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
            url = location.origin;
        } else {
            url = `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}`;
        }
        // const url = `${location.protocol}//${location.hostname}:30010`;
        socket = io(url, { path: monitorBackend.path, transports: ['websocket'] });

        // socket = io(action.payload.currentSelection.url, { path: action.payload.currentSelection.path, transports: ['websocket'] });
    // /socket = io(action.payload.currentSelection.url, { transports: ['websocket'] });
        socket.on('connect', () => {
            console.log(`connected...${socket.id}`);
            connected = true;
        });

        Object.keys(currentTopicRegisterd).forEach((act) => {
            socket.on(currentTopicRegisterd[act].payload.topic, (data) => {
                success(dispatch, data, currentTopicRegisterd[act]);
            });
        });
    }
    if (action.type === AT.SOCKET_INIT) {
    // verify if topic is already  registerd inorder to prevent duplicate registretion
        if (!Object.keys(currentTopicRegisterd).includes(action.payload.topic)) {
      // socket.emit(topics.OPEN_TERMINAL, { id: socket.id });
            if (socket != null) {
                socket.on(action.payload.topic, (data) => {
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
