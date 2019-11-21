import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Trace from 'jaeger-react-trace-component';
import { Tabs, Card, JsonView, FlexBox } from 'components/common';
import { JobGraph } from '.';
import { Button, notification, Icon, Spin, Result } from 'antd';
import axios from 'axios';
import { STATE_SOURCES } from 'const';
import { transformTraceData } from 'utils';
import JsonTable from 'components/common/Json/JsonTable/JsonTable.react';

const CenterDiv = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  max-width: 50vw;
`;

const configNotificationOnOpen = description => ({
  message: 'Error fetching Trace data',
  description,
  icon: <Icon type="warning" style={{ color: 'red' }} />,
});

const TABS = { GRAPH: 'Graph', TRACE: 'Trace', JSON_TABLE: 'JSON Table', JSON: 'JSON' };

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      {key === TABS.JSON_TABLE ? value : <Card>{value}</Card>}
    </Tabs.TabPane>
  ));

const fetchTraceData = ({ url, jobId, callback }) =>
  axios
    .get(`${url}/jaeger`, {
      params: {
        jobId,
      },
    })
    .then(({ data }) => {
      const [traceData] = data.data;
      callback(transformTraceData(traceData || {}));
    })
    .catch(e => notification.open(configNotificationOnOpen(e.message)));

const JobsTabSwitcher = ({ record }) => {
  const [traceData, setTraceData] = useState(undefined);
  const [currentTab, setCurrentTab] = useState(TABS.GRAPH);

  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);

  const fetchTrace = useCallback(
    () => fetchTraceData({ url: socketURL, jobId: record.key, callback: setTraceData }),
    [record.key, socketURL],
  );

  useEffect(() => {
    if (!traceData) {
      fetchTrace();
    }
  }, [fetchTrace, traceData]);

  const onRefreshClick = () => setTraceData(undefined);
  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={onRefreshClick} icon="redo">
      Refresh
    </Button>
  );

  const tabs = {
    [TABS.GRAPH]: (
      <JobGraph graph={{ ...record.graph, jobId: record.key }} pipeline={record.record.pipeline} />
    ),
    [TABS.TRACE]:
      traceData === null ? (
        <Result status="warning" title="No such trace has been found." />
      ) : traceData ? (
        <Trace trace={{ data: traceData }} />
      ) : (
        <CenterDiv>
          <Spin size="large" tip="Fetching Trace Data 🔎..." />
        </CenterDiv>
      ),
    [TABS.JSON_TABLE]: (
      <FlexBox justify="center">
        <FlexBox.Item>
          <Wrapper>
            <JsonTable jsonObject={record.record} />
          </Wrapper>
        </FlexBox.Item>
      </FlexBox>
    ),
    [TABS.JSON]: <JsonView jsonObject={record.record} />,
  };

  const onTabClick = tabKey => tabKey === TABS.TRACE && fetchTrace();

  return (
    <Tabs
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}
      onTabClick={onTabClick}>
      {generateTabs(tabs)}
    </Tabs>
  );
};

JobsTabSwitcher.propTypes = {
  record: PropTypes.object.isRequired,
};

export default JobsTabSwitcher;
