import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Fallback } from '..';
import { ControlledEditor } from '@monaco-editor/react';

// const { ControlledEditor: MonacoEditor } = lazy(() => import('@monaco-editor/react'));

const JsonEditor = ({ onChange, value: controlledValue, ...props }) => {
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = (_, value) => setValue(value);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  useEffect(() => {
    setValue(controlledValue);
  }, [controlledValue]);

  return (
    <Fallback>
      <ControlledEditor {...props} language="json" value={value} onChange={handleEditorChange} />
    </Fallback>
  );
};

JsonEditor.defaultProps = {
  value: '',
  height: '60vh',
  onChange: () => {}
};

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  ...ControlledEditor.propTypes
};

export default JsonEditor;
