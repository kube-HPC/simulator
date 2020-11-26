import styled from 'styled-components';

export const FileIcon = styled.b`
  width: 4em;
  height: 4em;
  background: #ccc;
  border-radius: 1em;
  text-align: center;
  line-height: 4em;
  margin: 0.5em 1ch;
`;

export const fileTypes = {
  'application/json': { name: 'JSON' },
  'text/markdown': { name: 'MD' },
  'text/plain': { name: 'TXT' },
  'image/gif': { name: 'GIF' },
  'image/jpeg': { name: 'JPG' },
  'text/csv': { name: 'CSV' },
  default: { name: '?' },
};
