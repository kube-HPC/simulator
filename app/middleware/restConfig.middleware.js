import AT from '../constants/actions';
import topics from '../constants/topics';

//const API_URL = 'http://101.150.4.70:8080';


// let socket = io(API_URL,{path:'/api/v1/proxy/namespaces/default/services/worker-statistics-server/socket.io'});


const reject = (dispatch, payload, action) => {
  dispatch({
    type: action.payload.actionType + '_REJECT',
    meta: action.meta,
    payload
  });
};

const pending = (dispatch, payload, action) => {
  dispatch({
    type: action.payload.actionType + '_PENDING',
    meta: action.meta,
    payload
  });
};

const success = (dispatch, payload, action) => {
   setTimeout(()=>{
     dispatch({
      type: action.payload.actionType + '_SUCCESS',
      meta: action.meta,
      payload
    });
   },100) 
};

export const restConfigMiddleware = ({ dispatch }) => (next) => (action) => {
  if (![AT.REST_REQ].includes(action.type)) {
    return next(action);
  }

  if (action.type === AT.REST_REQ) {
    pending(dispatch, 'pending', action)
    fetch(action.payload.url).then((res) => {
      res.json().then((data) => {
        console.log(data);
        success(dispatch, data, action)
      })
    }).catch((err) => {
      reject(dispatch, err, action)
      console.error('get config error')
    })
  } else {
   // console.warn(`rest middlware: trying to register topic ${action.payload.topic} twice `)
  }
  return next(action);
}


