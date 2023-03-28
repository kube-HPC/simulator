import React from 'react';
import PropTypes from 'prop-types';
import MdEditorReact from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { readmeTemplate } from 'config';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

const parser = new MarkdownIt();
const configReadOnly = { view: { menu: false, md: false, html: true } };
const renderHtml = text => parser.render(text);
const noop = () => {};

const MdEditor = ({
  value: initialValue = readmeTemplate,
  onChange = noop,
  viewReadOnly,
}) => {
  const handleValueChange = ({ text }) => {
    onChange(text);
  };

  return (
    <MdEditorReact
      value={initialValue}
      onChange={handleValueChange}
      renderHTML={renderHtml}
      config={viewReadOnly && configReadOnly}
    />
  );
};

MdEditor.propTypes = {
  value: PropTypes.string.isRequired,
  // eslint-disable-next-line
  onChange: PropTypes.func,
  viewReadOnly: PropTypes.bool,
};

MdEditor.defaultProps = {
  viewReadOnly: false,
};

export default MdEditor;
