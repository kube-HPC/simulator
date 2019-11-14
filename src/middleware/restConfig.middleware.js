import AT from '../const/application-actions';

const reject = (dispatch, payload, action) => {
  dispatch({
    type: `${action.payload.actionType}_REJECT`,
    meta: action.meta,
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
  setTimeout(() => {
    dispatch({
      type: `${action.payload.actionType}_SUCCESS`,
      meta: action.meta,
      payload,
    });
  }, 100);
};

const restConfigMiddleware = ({ dispatch }) => next => action => {
  if (![AT.REST_REQ_CONFIG].includes(action.type)) {
    return next(action);
  }

  if (action.type === AT.REST_REQ_CONFIG) {
    pending(dispatch, 'pending', action);
    fetch(`${location.origin}${location.pathname}${action.payload.url}`) //eslint-disable-line
      .then(res => {
        //eslint-disable-line
        res
          .json()
          .then(data => {
            success(dispatch, data, action);
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        reject(dispatch, err, action);
        console.error('get config error');
      });
  } else {
    console.warn(`rest middleware: trying to register topic ${action.payload.topic} twice `);
  }
  return next(action);
};

export default restConfigMiddleware;
