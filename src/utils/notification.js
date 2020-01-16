import { notification as notificationAntd } from 'antd';

const TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

const msg = 'Something Went Wrong!';

const notification = ({ message = msg, description, type = TYPES.ERROR }) =>
  notificationAntd[type]({
    message,
    description,
    style: { zIndex: 10000 },
  });

notification.TYPES = TYPES;

export default notification;
