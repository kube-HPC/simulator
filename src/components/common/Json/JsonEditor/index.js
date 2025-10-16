import { Editor } from '@monaco-editor/react'; // Import Editor instead of ControlledEditor
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { useSiteThemeMode } from 'hooks';

const JsonEditor = ({
  onChange = () => {},
  value: controlledValue = {},
  innerRef = { current: undefined },
  onSave = () => {},
  ...props
}) => {
  const { themeName } = useSiteThemeMode();

  const getMonacoTheme = () => {
    if (themeName === 'dark' || themeName.includes('dark')) {
      return 'vs-dark'; // Monaco's built-in dark theme
    }
    return 'vs'; // Monaco's built-in light theme (default)
  };
  const [value, setValue] = useState(controlledValue);
  const handleEditorChange = _value => setValue(_value);

  const handleEditorDidMount = (editor, monaco) => {
    const ref = innerRef;
    ref.current = editor;

    // Bind Ctrl+S inside editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave(editor.getValue());
    });
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
          theme={getMonacoTheme()} // Use Monaco's built-in themes
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
  onSave: PropTypes.func,
  innerRef: PropTypes.shape({ current: PropTypes.object }),
};

export default JsonEditor;
