import { Editor } from '@monaco-editor/react'; // Import Editor instead of ControlledEditor
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { useSiteThemeMode } from 'hooks';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = {},
  innerRef = { current: undefined },
  ...props
}) => {
  const { themeName } = useSiteThemeMode();
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = _value => setValue(_value);

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
        <Editor
          theme={themeName}
          {...props}
          width={width}
          height={height}
          language="json"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      )}
    </AutoSizer>
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  innerRef: PropTypes.oneOfType(PropTypes.object).isRequired,
};

export default JsonEditor;
