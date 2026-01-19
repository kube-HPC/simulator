import { message } from 'antd';
import { events } from 'utils';

export default () => next => action => {
  if (action.meta?.message) {
    const { type, content } = action.meta.message;

    if (!type || !content) {
      return next(action);
    }

    if (message[type]) {
      events.emit('global_alert_msg', content, type);
    } else {
      console.warn(`Unknown message type: ${type}`);
    }
  }

  return next(action);
};
