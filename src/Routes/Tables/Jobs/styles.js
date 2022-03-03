import { Tabs as AntTabs } from 'antd';
import styled from 'styled-components';

export const Tabs = styled(AntTabs)`
  .ant-tabs-content {
    flex: 1;
  }

  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const Pane = styled(Tabs.TabPane)`
  height: 100%;
  display: flex;
  flex-direction: row;
`;
export const PaneRow = styled(Tabs.TabPane)`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const PanePadding = styled(Tabs.TabPane)`
  padding-top: 10px;
`;

export const LinkDownload = styled.div`
  margin-bottom: 15px;
`;
