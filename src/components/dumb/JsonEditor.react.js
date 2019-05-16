import React from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from 'react-monaco-editor';

export default function JsonEditor({ width, height, ...props }) {
  return (
    <MonacoEditor
      width={width || 800}
      height={height || 600}
      language="json"
      {...props}
    />
  );
}

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  snippetEnabled: PropTypes.bool,
  showGutter: PropTypes.bool,
  style: PropTypes.object
};
