import React from 'react';
import styled from 'styled-components';

const FileIcon = styled.b`
  width: 4em;
  height: 4em;
  background: #ccc;
  border-radius: 1em;
  text-align: center;
  line-height: 4em;
  margin: 0.5em 1ch;
`;

export default {
  'application/json': () => <FileIcon>JSON</FileIcon>,
  'text/markdown': () => <FileIcon>MD</FileIcon>,
  'text/plain': () => <FileIcon>TXT</FileIcon>,
  'image/gif': () => <FileIcon>GIF</FileIcon>,
  'image/jpeg': () => <FileIcon>JPG</FileIcon>,
  'text/csv': () => <FileIcon>CSV</FileIcon>,
  default: () => <FileIcon>?</FileIcon>,
};
