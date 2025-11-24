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

export const copyToClipboard = async content => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(content);
      notification({
        message: 'Copied to clipboard',
        type: notification.TYPES.SUCCESS,
      });
      return;
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  }

  // fallback old browser (work in http url)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    notification({
      message: 'Copied to clipboard success',
      type: notification.TYPES.SUCCESS,
    });
  } catch (err) {
    notification({
      message: 'Copy failed',
      type: notification.TYPES.ERROR,
    });
  }
};
