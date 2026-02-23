import React from 'react';
import PropTypes from 'prop-types';

const CopyToClipboard = ({ text, onCopy, children }) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (onCopy) onCopy(text, true);
    } catch (err) {
      console.error('Copy failed:', err);
      if (onCopy) onCopy(text, false);
    }
  };

  return React.cloneElement(children, {
    onClick: handleClick,
  });
};

CopyToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default CopyToClipboard;
