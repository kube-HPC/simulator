import { Empty } from 'antd';
import { Table } from 'components';
import { Card, JsonView, LogsViewer, Tabs } from 'components/common';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import getBuildsTableColumns from '../../getBuildsTableColumns.react';

const IDs = {
  LOGS: 'Logs',
  INFO: 'Information',
};

const CardOverflow = styled(Card)`
  max-height: 60vh;
`;

const AlgorithmBuildsTable = ({ builds }) => {
  const { cancelBuild, rerunBuild } = useActions();

  return (
    <Table
      rowKey={record => record.buildId}
      columns={getBuildsTableColumns({ cancelBuild, rerunBuild })}
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
            <Tabs.TabPane tab={IDs.INFO} key={IDs.INFO}>
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
