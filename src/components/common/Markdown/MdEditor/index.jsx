import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MdEditorReact from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { readmeTemplate } from 'config';
import 'react-markdown-editor-lite/lib/index.css';

const parser = new MarkdownIt();
const configReadOnly = { view: { menu: false, md: false, html: true } };
const renderHtml = text => parser.render(text);
const noop = () => {};

const MdEditor = ({
  value: initialValue = readmeTemplate || '',
  onChange = noop,
  viewReadOnly = false,
}) => {
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    // Apply template fallback for empty/null values
    const finalValue =
      !initialValue || initialValue === 'null' || initialValue.trim() === ''
        ? readmeTemplate
        : initialValue;

    setEditorValue(finalValue);
  }, [initialValue]);

  const handleValueChange = ({ text }) => {
    setEditorValue(text);
    onChange(text);
  };

  return (
    <MdEditorReact
      value={editorValue}
      onChange={handleValueChange}
      renderHTML={renderHtml}
      config={viewReadOnly && configReadOnly}
    />
  );
};

MdEditor.propTypes = {
  value: PropTypes.string,
  // eslint-disable-next-line
  onChange: PropTypes.func,
  viewReadOnly: PropTypes.bool,
};

export default MdEditor;
