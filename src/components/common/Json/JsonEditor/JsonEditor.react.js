import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/react';
import Fallback from 'components/common/Fallback.react';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = '',
  height = '60vh',
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
    <Fallback>
      <ControlledEditor
        {...props}
        height={height}
        language="json"
        value={value}
        onChange={handleEditorChange}
      />
    </Fallback>
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func,
  ...ControlledEditor.propTypes,
};

export default JsonEditor;
