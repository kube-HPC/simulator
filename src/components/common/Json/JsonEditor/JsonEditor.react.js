import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/react';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = '',
  height = '80vh',
  ...props
}) => {
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = (_, value) => setValue(value);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  useEffect(() => {
    setValue(controlledValue);
  }, [controlledValue]);

  return (
    <ControlledEditor
      {...props}
      height={height}
      language="json"
      value={value}
      onChange={handleEditorChange}
    />
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  ...ControlledEditor.propTypes,
};

export default JsonEditor;
