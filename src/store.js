import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import rootReducer from 'reducers/root.reducer';
import socketMiddleware from 'middleware/socket.middleware';
import restConfigMiddleware from 'middleware/restConfig.middleware';
import restMiddleware from 'middleware/rest.middleware';
import messagesMiddleware from 'middleware/messages.middleware';

const middleware = [
  messagesMiddleware,
  socketMiddleware,
  restConfigMiddleware,
  restMiddleware,
];

if (process.env.NODE_ENV === 'development') {
  middleware.unshift(createLogger({ collapsed: true }));
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), ...middleware],
});
export default store;
