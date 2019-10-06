import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { cancelBuild, rerunBuild } from 'actions/builds.action';
import { Card, JsonView } from 'components/common';
import { Table } from 'components';

import getBuildsTableColumns from './getBuildsTableColumns.react';

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
