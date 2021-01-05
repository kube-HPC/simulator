import { COLOR_LAYOUT } from 'styles';
import styled from 'styled-components';
import { BottomPanel as CommonBottomPanel } from 'components/Drawer';
import { Button } from 'antd';

export const BottomPanel = styled(CommonBottomPanel)`
  margin-top: auto;
  margin-bottom: -0.5em;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  margin-top: 0;
`;

export const Row = styled.section`
  margin: 0 auto;
  margin-top: 1em;
  width: 100%;
`;

export const FileBrowserContainer = styled.section`
  flex: 1;
  margin: 0;
  margin-top: 1em;
`;

export const RightButton = styled(Button)`
  margin-left: auto;
`;
