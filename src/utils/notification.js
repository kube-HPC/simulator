import { notification as notificationAntd } from 'antd';

const TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

const msg = 'Something Went Wrong!';
/**
 * @param {object} props
 * @param {'success' | 'info' | 'warning' | 'error'} props.type
 * @param {string} props.message
 * @param {string} props.description
 */
const notification = ({ message = msg, description, type = TYPES.ERROR }) =>
  notificationAntd[type]({
    message,
    description,
    style: { zIndex: 10000 },
  });

notification.TYPES = TYPES;

export default notification;

export const copyToClipboard = content => {
  navigator.clipboard.writeText(content);
  notification({
    message: 'Copied to clipboard',
    type: notification.TYPES.SUCCESS,
  });
};
