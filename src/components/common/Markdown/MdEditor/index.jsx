import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MDEditor from '@uiw/react-md-editor';
import { readmeTemplate } from 'config';

const MdEditorView = ({
  value: initialValue = readmeTemplate || '',
  onChange = () => {},
  viewReadOnly = false,
}) => {
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    const finalValue =
      !initialValue || initialValue === 'null' || initialValue.trim() === ''
        ? readmeTemplate
        : initialValue;

    setEditorValue(finalValue);
  }, [initialValue]);

  const handleChange = val => {
    setEditorValue(val);
    onChange(val);
  };

  return (
    <div data-color-mode="light" style={{ marginTop: 10 }}>
      {viewReadOnly ? (
        <MDEditor.Markdown source={editorValue} />
      ) : (
        <MDEditor value={editorValue} onChange={handleChange} height="80vh" />
      )}
    </div>
  );
};

MdEditorView.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  viewReadOnly: PropTypes.bool,
};

export default MdEditorView;
