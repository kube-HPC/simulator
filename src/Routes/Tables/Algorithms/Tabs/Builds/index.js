import { Empty } from 'antd';
import { Table } from 'components';
import { Card, JsonView, LogsViewer, Tabs } from 'components/common';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import getColumns from './getColumns';

const IDs = {
  LOGS: 'Logs',
  INFO: 'Information',
};

const CardOverflow = styled(Card)`
  max-height: 60vh;
  min-height: 20em;
`;

const expandedRowRender = record => (
  <Card isMargin>
    <Tabs>
      <Tabs.TabPane tab={IDs.LOGS} key={IDs.LOGS}>
        <CardOverflow bodyStyle={{ height: '20em' }}>
          {record.result && record.result.data ? (
            <LogsViewer
              id={record.buildId}
              dataSource={record.result.data.split('\n')}
              isBuild
            />
          ) : (
            <Empty />
          )}
        </CardOverflow>
      </Tabs.TabPane>
      <Tabs.TabPane tab={IDs.INFO} key={IDs.INFO}>
        <Card>
          <JsonView.Card jsonObject={record} collapsed="1" />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  </Card>
);

const Builds = ({ builds }) => {
  const { cancelBuild, rerunBuild } = useActions();
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [setCurrentTime]);

  return (
    <Table
      rowKey={record => record.buildId}
      columns={getColumns({ cancelBuild, rerunBuild, currentTime })}
      dataSource={builds}
      expandable={{
        expandedRowRender,
        // eslint-disable-next-line react/prop-types
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          ),
      }}
    />
  );
};

Builds.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  builds: PropTypes.array,
};

Builds.defaultProps = {
  builds: [],
};

export default React.memo(Builds);
