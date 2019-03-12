import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/root.reducer';
import { socketioMiddleware } from '../middleware/socket.middleware';
import { restConfigMiddleware } from '../middleware/restConfig.middleware';
import { restMiddleware } from '../middleware/rest.middleware';

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middleware = [socketioMiddleware, restConfigMiddleware, restMiddleware];
if (process.env.NODE_ENV === 'development') {
  middleware.unshift(createLogger({ collapsed: true }));
}
const enhancer = composeEnhancers(applyMiddleware(...middleware));
export const store = createStore(rootReducer, enhancer);
if (process.env.NODE_ENV === 'development') {
  window.store = store;
}
export default store;
