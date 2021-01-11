import { message } from 'antd';

/**
 * @typedef {{
 *   type: string;
 *   content: string;
 * }} Message
 * @typedef {{
 *   meta?: { message?: Message };
 * }} MessageAction
 * @type {() => (next: function) => (action: MessageAction) => any}
 */
export default () => next => action => {
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
