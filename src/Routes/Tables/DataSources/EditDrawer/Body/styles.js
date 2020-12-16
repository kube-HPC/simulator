import { COLOR_LAYOUT } from 'styles';
import styled from 'styled-components';

export const BottomPanel = styled.footer`
  padding-top: 1em;
  margin-top: auto;
  margin-bottom: -0.5em;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  text-align: right;
`;

export const Row = styled.section`
  margin: 0 auto;
  margin-top: 1em;
`;

export const FileBrowserContainer = styled.section`
  flex: 1;
  margin: 0;
  margin-top: 1em;
`;
