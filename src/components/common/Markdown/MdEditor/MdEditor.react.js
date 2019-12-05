import React from 'react';
import PropTypes from 'prop-types';
import MdEditorReact from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();
const renderHtml = text => parser.render(text);
const noop = () => {};

const MdEditor = ({ value: initialValue = '', onChange = noop }) => {
  const handleValueChange = ({ text }) => {
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
