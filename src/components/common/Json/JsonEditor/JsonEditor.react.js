import { ControlledEditor } from '@monaco-editor/react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = '',
  height = '60vh',
  innerRef,
  ...props
}) => {
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = (_, value) => setValue(value);

  const handleEditorDidMount = (_, editor) => {
    innerRef.current = editor;
  };

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
      editorDidMount={handleEditorDidMount}
    />
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  ...ControlledEditor.propTypes,
};

export default JsonEditor;
