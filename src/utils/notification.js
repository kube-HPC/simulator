import { events } from 'utils/events';

const TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

const defaultMsg = 'Something Went Wrong!';

/**
 * @param {object} props
 * @param {'success' | 'info' | 'warning' | 'error'} props.type
 * @param {string} props.message
 * @param {string} props.description
 */
const notification = ({
  message = defaultMsg,
  description,
  type = TYPES.ERROR,
}) => events.emit('global_notification_msg', { type, message, description });

notification.TYPES = TYPES;

export default notification;
