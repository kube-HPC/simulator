import { cancelBuild, rerunBuild } from 'actions/builds.action';
import { Empty } from 'antd';
import { Table } from 'components';
import { Card, JsonView, LogsViewer, Tabs } from 'components/common';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import getBuildsTableColumns from '../../getBuildsTableColumns.react';

const IDs = {
  LOGS: 'Logs',
  JSON: 'JSON',
};

const CardOverflow = styled(Card)`
  max-height: 60vh;
`;

const AlgorithmBuildsTable = ({ builds }) => {
  const dispatch = useDispatch();

  const onCancel = useCallback(data => dispatch(cancelBuild(data)), [dispatch]);
  const onRerun = useCallback(data => dispatch(rerunBuild(data)), [dispatch]);

  return (
    <Table
      rowKey={record => record.buildId}
      columns={getBuildsTableColumns({ onCancel, onRerun })}
      dataSource={builds}
      expandedRowRender={record => (
        <Card isMargin>
          <Tabs>
            <Tabs.TabPane tab={IDs.LOGS} key={IDs.LOGS}>
              <CardOverflow>
                {record.result && record.result.data ? (
                  <LogsViewer dataSource={record.result.data} isBuild />
                ) : (
                  <Empty />
                )}
              </CardOverflow>
            </Tabs.TabPane>
            <Tabs.TabPane tab={IDs.JSON} key={IDs.JSON}>
              <Card>
                <JsonView jsonObject={record} collapsed="1" />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      )}
    />
  );
};

AlgorithmBuildsTable.defaultProps = {
  builds: [],
};

AlgorithmBuildsTable.propTypes = {
  builds: PropTypes.array,
};

export default AlgorithmBuildsTable;
