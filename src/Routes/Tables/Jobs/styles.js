import { Tabs as AntTabs } from 'antd';
import styled from 'styled-components';

export const Tabs = styled(AntTabs)`
  height: 100%;
  min-height: 0;

  .ant-tabs-content-holder {
    height: 100%;
    min-height: 0;
  }

  .ant-tabs-content {
    flex: 1;
    height: 100%;
    min-height: 0;
  }

  .ant-tabs-tabpane {
    height: 100%;
    min-height: 0;
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
