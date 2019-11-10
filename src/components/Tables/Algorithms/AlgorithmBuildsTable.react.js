import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import Ansi from 'ansi-to-react';
import { Collapse } from 'antd';

import { cancelBuild, rerunBuild } from 'actions/builds.action';
import { Card, JsonView } from 'components/common';
import { Table } from 'components';

import getBuildsTableColumns from './getBuildsTableColumns.react';

const { Panel } = Collapse;

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
          <JsonView jsonObject={record} collapsed="1" />
          <Collapse bordered={false}>
            <Panel header="Build Log">
              <Ansi className="ansi-view-class">
                {record.result && record.result.data ? record.result.data : 'No Output'}
              </Ansi>
            </Panel>
          </Collapse>
        </Card>
      )}
    />
  );
};

AlgorithmBuildsTable.defaultProps = {
  builds: []
};

AlgorithmBuildsTable.propTypes = {
  builds: PropTypes.array
};

export default AlgorithmBuildsTable;
