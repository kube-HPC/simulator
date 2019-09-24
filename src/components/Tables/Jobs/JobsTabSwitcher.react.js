import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Trace from 'jaeger-react-trace-component';
import { Tabs, Card, JsonView } from 'components/common';
import { JobGraph } from '.';
import { Button, notification, Icon, Spin } from 'antd';
import axios from 'axios';
import { STATE_SOURCES } from 'const';
import { transformTraceData } from 'utils';

const CenterDiv = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const configNotificationOnOpen = description => ({
  message: 'Error fetching Trace data',
  description,
  icon: <Icon type="error" style={{ color: 'red' }} />
});

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      <Card>{value}</Card>
    </Tabs.TabPane>
  ));

const tabsAnimation = { inkBar: true, tabPane: false };
const TABS = { GRAPH: 'Graph', TRACE: 'Trace', JSON: 'JSON' };

const fetchTraceData = ({ url, jobId, callback }) =>
  axios
    .get(`${url}/jaeger`, {
      params: {
        jobId
      }
    })
    .then(({ data }) => {
      const [traceData] = data.data;
      callback(transformTraceData(traceData));
    })
    .catch(message => notification.open(configNotificationOnOpen(message)));

const JobsTabSwitcher = ({ record }) => {
  const [traceData, setTraceData] = useState(undefined);
  const [currentTab, setCurrentTab] = useState(TABS.GRAPH);

  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  const fetchTrace = useCallback(
    () => fetchTraceData({ url: socketURL, jobId: record.key, callback: setTraceData }),
    [record.key, socketURL]
  );

  useEffect(() => {
    if (!traceData) fetchTrace();
  }, [fetchTrace, traceData]);

  const tabs = {
    [TABS.GRAPH]: (
      <JobGraph graph={{ ...record.graph, jobId: record.key }} pipeline={record.record.pipeline} />
    ),
    [TABS.TRACE]: traceData ? (
      <Trace trace={{ data: traceData }} />
    ) : (
      <CenterDiv>
        <Spin size="large" tip="Fetching Trace Data 🔎..." />
      </CenterDiv>
    ),
    [TABS.JSON]: <JsonView jsonObject={record.record} />
  };

  const onRefreshClick = () => setTraceData(undefined);
  const tabBarExtraContent = currentTab === TABS.TRACE && (
    <Button onClick={onRefreshClick} icon="redo">
      Refresh
    </Button>
  );

  const onTabClick = tabKey => tabKey === TABS.TRACE && fetchTrace();

  return (
    <Tabs
      activeKey={currentTab}
      animated={tabsAnimation}
      tabBarExtraContent={tabBarExtraContent}
      onChange={setCurrentTab}
      onTabClick={onTabClick}
    >
      {generateTabs(tabs)}
    </Tabs>
  );
};

JobsTabSwitcher.propTypes = {
  record: PropTypes.object.isRequired
};

export default JobsTabSwitcher;
