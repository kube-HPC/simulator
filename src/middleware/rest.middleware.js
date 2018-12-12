import AT from '../constants/actions';
import axios from 'axios';
let url = null;
const reject = (dispatch, payload, action) => {
  dispatch({
    type: `${action.payload.actionType}_REJECT`,
    meta: action.meta,
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
  setTimeout(() => {
    dispatch({
      type: `${action.payload.actionType}_SUCCESS`,
      meta: action.meta,
      payload
    });
  }, 100);
};

const setPath = ({ monitorBackend }) => {
  let _url;
  if (monitorBackend.useLocation) {
    _url = `${location.origin}${monitorBackend.path}`; //eslint-disable-line
  } else {
    _url = `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}`;
  }

  return _url;
};
export const restMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type === `${AT.GET_CONFIG}_SUCCESS`) {
    url = setPath(action.payload.config);
  } else if (![AT.REST_REQ, AT.REST_REQ_POST, AT.REST_REQ_DELETE].includes(action.type)) {
    return next(action);
  } else if (action.type === AT.REST_REQ) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    fetch(`${url}${action.payload.url}`).then((res) => {
      res.json().then((data) => {
        console.log(data);
        success(dispatch, data, action);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((err) => {
      reject(dispatch, err, action);
      console.error('get config error');
    });

    return next(action);
  } else if (action.type === AT.REST_REQ_POST) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios.post(`${url}/${action.payload.url}`, { ...action.payload.body })
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          success(dispatch, data, action);
        });
      }).catch((err) => {
        reject(dispatch, err, action);
        console.error('get config error');
      });
    // fetch(`${url}/${action.payload.url}`, {
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(action.payload.body)
    // }).then((res) => {
    //   res.json().then((data) => {
    //     console.log(data);
    //     success(dispatch, data, action);
    //   });
    // }).catch((err) => {
    //   reject(dispatch, err, action);
    //   console.error('get config error');
    // });

    return next(action);
  } else if (action.type === AT.REST_REQ_DELETE) {
    if (!url) {
      return next(action);
    }
    pending(dispatch, 'pending', action);
    axios.delete(`${url}/${action.payload.url}/${action.payload.body.algorithmName}`, { data: action.payload.body })
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          success(dispatch, data, action);
        });
      }).catch((err) => {
        reject(dispatch, err, action);
        console.error('get config error');
      });
    // fetch(`${url}/${action.payload.url}`, {
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(action.payload.body)
    // }).then((res) => {
    //   res.json().then((data) => {
    //     console.log(data);
    //     success(dispatch, data, action);
    //   });
    // }).catch((err) => {
    //   reject(dispatch, err, action);
    //   console.error('get config error');
    // });

    return next(action);
  }
};

