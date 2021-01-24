import { Tabs as AntTabs } from 'antd';
import styled from 'styled-components';

export const Tabs = styled(AntTabs)`
  .ant-tabs-content {
    flex: 1;
  }
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Pane = styled(Tabs.TabPane)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
