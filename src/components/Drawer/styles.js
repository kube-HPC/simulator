import { COLOR_LAYOUT } from 'styles';
import styled from 'styled-components';
import { Button } from 'antd';

export const BottomPanel = styled.div`
  display: flex;
  padding-top: 1em;
  margin-bottom: -1em;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  margin-top: 1em;
`;

export const PanelButtonWizard = styled(Button)`
  margin-left: 2ch;
`;

export const PanelButton = styled(Button)`
  margin-right: 1ch;
`;

export const RightAlignedButton = styled(Button)`
  margin-left: auto;
`;

export const RightAlignedBox = styled.div`
  margin-left: auto;
`;

export const RightPanel = styled.div`
  margin-left: auto;
`;
