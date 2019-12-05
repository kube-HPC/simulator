import { message } from 'antd';

export default () => next => action => {
  /**
   * @{param} action.meta.message - used to decide if the middleware should be used
   * @{param} action.meta.message.type - success or error
   * @{param} action.meta.message.content - the content of the message
   */
  if (
    action.meta &&
    action.meta.message &&
    action.meta.message.type &&
    action.meta.message.content
  ) {
    message[action.meta.message.type](action.meta.message.content);
  }
  return next(action);
};
