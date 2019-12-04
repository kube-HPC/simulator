import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { EmptyMarkdown } from 'components/common';

const MarkdownViewer = ({ source = undefined }) =>
  source ? <ReactMarkdown source={source} /> : <EmptyMarkdown />;

MarkdownViewer.propTypes = {
  source: PropTypes.string,
};

export default MarkdownViewer;
