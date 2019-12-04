import React from 'react';
import { SB_SECTIONS } from 'const';
import MarkdownViewer from './MarkdownViewer.react';

export default {
  title: `${SB_SECTIONS.MARKDOWN}Markdown Viewer`,
};

const source = `An **example** of writing a _markdown_`;

const config = { message: 'Update Algorithm' };

export const Default = () => <MarkdownViewer source={source} />;
export const Empty = () => <MarkdownViewer source={undefined} config={config} />;
