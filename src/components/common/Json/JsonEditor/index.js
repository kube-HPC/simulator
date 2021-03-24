import { ControlledEditor } from '@monaco-editor/react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AutoSizer } from 'react-virtualized';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = '',
  // height = '60vh',
  innerRef = { current: undefined },
  ...props
}) => {
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = (_, _value) => setValue(_value);

  const handleEditorDidMount = (_, editor) => {
    // eslint-disable-next-line
    innerRef.current = editor;
  };

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  useEffect(() => {
    setValue(controlledValue);
  }, [controlledValue]);

  return (
    <AutoSizer>
      {({ width, height }) => (
        <ControlledEditor
          t={console.log({ width, height })}
          {...props}
          width={width}
          height={height}
          language="json"
          value={value}
          onChange={handleEditorChange}
          editorDidMount={handleEditorDidMount}
        />
      )}
    </AutoSizer>
  );
};

JsonEditor.propTypes = {
  // eslint-disable-next-line
  onChange: PropTypes.func,
  ...ControlledEditor.propTypes,
};

export default JsonEditor;
