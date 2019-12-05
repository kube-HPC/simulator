import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MdEditorReact from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();
const renderHtml = text => parser.render(text);
const noop = () => {};

const MdEditor = ({ value: initialValue = '', onChange = noop }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(value);
  }, [initialValue]);

  const handleValueChange = ({ text }) => {
    setValue(text);
    onChange(text);
  };

  return (
    <MdEditorReact value={initialValue} onChange={handleValueChange} renderHTML={renderHtml} />
  );
};

MdEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default MdEditor;
