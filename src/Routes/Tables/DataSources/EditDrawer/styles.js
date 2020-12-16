import { COLOR_LAYOUT } from 'styles';
import styled from 'styled-components';

export const BottomPanel = styled.footer`
  padding-top: 1em;
  margin-top: auto;
  margin-bottom: -0.5em;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  text-align: right;
`;

export const FileUploadContainer = styled.div`
  margin: 0 auto;
  margin-top: 1em;
`;

export const FileBrowserContainer = styled.div`
  height: 400;
  margin: 1em 0;
`;
