import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';

export default function JsonEditor({ width, height, isControlled, ...props }) {
  const [value, setValue] = useState(props.value);
  return (
    <MonacoEditor
      {...props}
      width={width || 800}
      height={height || 600}
      language="json"
      value={isControlled ? props.value : value}
      onChange={data => {
        !isControlled && setValue(data);
        props.onChange && props.onChange(data);
      }}
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
