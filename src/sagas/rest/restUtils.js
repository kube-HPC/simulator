import successMsg from 'config/schema/success-messages.schema';

class RestUtils {
  constructor(defaultErrorMessage) {
    this.defaultErrorMessage = defaultErrorMessage;
  }

  generatePendingObj = (action, payload = 'pending') => ({
    type: `${action.payload.actionType}_PENDING`,
    meta: action.meta,
    payload
  });

  generateSuccessObj = (payload, action) => {
    const successMessagesMapping = successMsg(payload);
    const actionType = action.payload.actionType;
    return {
      type: `${actionType}_SUCCESS`,
      meta: {
        message: {
          type: 'success',
          content: successMessagesMapping[actionType]
        }
      },
      payload
    };
  };

  _formatError = payload => {
    if (!payload) return this.defaultErrorMessage;
    return typeof payload === 'string' ? payload : payload.message || this.defaultErrorMessage;
  };

  generateRejectObj = (payload, action) => {
    return {
      type: `${action.payload.actionType}_REJECT`,
      meta: {
        message: {
          type: 'error',
          content: this._formatError(payload)
        }
      },
      payload
    };
  };

  setPath = ({ monitorBackend }) => {
    return new Promise(resolve => {
      let _url;
      if (monitorBackend.useLocation) {
        _url = `${location.origin}${monitorBackend.path}`; //eslint-disable-line
      } else {
        _url = `${monitorBackend.schema}${monitorBackend.host}:${monitorBackend.port}${monitorBackend.path}`;
      }

      return resolve(_url);
    });
  };
}

export default RestUtils;
