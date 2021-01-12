import styled from 'styled-components';
import './categories.css';

export const FileIcon = styled.b`
  width: 4em;
  height: 4em;
  background: #ccc;
  color: #666;
  border-radius: 1em;
  text-align: center;
  line-height: 4em;
  margin: 0.5em 1ch;
`;

export const fileTypes = {
  'application/json': { name: 'JSON', category: 'text' },
  'text/markdown': { name: 'MD', category: 'text' },
  'text/plain': { name: 'TXT', category: 'text' },
  'text/csv': { name: 'CSV', category: 'text' },
  'image/gif': { name: 'GIF', category: 'image' },
  'image/jpeg': { name: 'JPG', category: 'image' },
  'image/png': { name: 'PNG', category: 'image' },
  'image/svg+xml': { name: 'SVG', category: 'image' },
  default: { name: '?' },
};
