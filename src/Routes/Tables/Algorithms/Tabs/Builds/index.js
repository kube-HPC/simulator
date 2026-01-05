import { Empty, Button } from 'antd';
import { Table } from 'components';
import { Card, JsonView, LogsViewer, Tabs } from 'components/common';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  DownOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import getColumns from './getColumns';

const IDs = {
  LOGS: 'Logs',
  INFO: 'Information',
};

const CardOverflow = styled(Card)`
  max-height: 60vh;
  min-height: 20em;
  padding-bottom: 20px;
`;

const downloadLogsAsText = async (buildIdStr, textContent) => {
  const blob = new Blob(textContent, { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const currentDate = new Date().toISOString();
  link.download = `logs_BuildId_${buildIdStr}_Date_${currentDate}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Builds = ({ builds = [], isOpenFirstLog = false }) => {
  const { cancelBuild, rerunBuild } = useActions();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [setCurrentTime]);

  const TabsItemsJson = useCallback(
    record => [
      {
        label: IDs.LOGS,
        key: IDs.LOGS,
        children: (
          <CardOverflow styles={{ body: { height: '20em' } }}>
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
        ),
      },
      {
        label: IDs.INFO,
        key: IDs.INFO,
        children: (
          <Card>
            <JsonView.Card jsonObject={record} collapsed="1" />
          </Card>
        ),
      },
    ],
    []
  );

  const expandedRowRender = record => (
    <Card isMargin>
      <Tabs
        items={TabsItemsJson(record)}
        extra={
          <Button
            disabled={!record?.result?.data}
            title={`download Logs buildId - ${record?.buildId}`}
            onClick={() =>
              downloadLogsAsText(
                record?.buildId,
                record?.result.data.split('\r\n\n')
              )
            }>
            <DownloadOutlined />
          </Button>
        }
      />
    </Card>
  );
  const expandIcon = ({ expanded, onExpand, record }) =>
    expanded ? (
      <DownOutlined onClick={e => onExpand(record, e)} />
    ) : (
      <RightOutlined onClick={e => onExpand(record, e)} />
    );
  return (
    <Table
      rowKey={record => record.buildId}
      columns={getColumns({ cancelBuild, rerunBuild, currentTime })}
      dataSource={builds}
      expandable={{
        defaultExpandedRowKeys: isOpenFirstLog ? [builds[0].buildId] : [],
        expandedRowRender,
        expandIcon,
      }}
    />
  );
};

Builds.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  builds: PropTypes.array,
  isOpenFirstLog: PropTypes.bool,
};

export default React.memo(Builds);
