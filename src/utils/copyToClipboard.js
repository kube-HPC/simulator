import notification from './notification';

const { SUCCESS, ERROR } = notification.TYPES;

export const copyToClipboard = async content => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(content);
      notification({
        message: 'Copied to clipboard',
        type: SUCCESS,
      });
      return;
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  }

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
      type: SUCCESS,
    });
  } catch (err) {
    notification({
      message: 'Copy failed',
      type: ERROR,
    });
  }
};
