import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import groupby from 'lodash/groupBy';

import { cancelBuild, rerunBuild } from 'actions/builds.action';

import {
  buildsTableColumns,
  nestedBuildsTableColumns
} from 'components/UI/tables/AlgorithmBuilds/AlgorithmBuildsTableColumns.react';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import JsonView from 'components/containers/json/JsonView.react';
import CardRow from 'components/containers/CardRow.react';

const tableDataSelector = createSelector(
  state => state.algorithmBuildsTable.dataSource,
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.algorithmName.includes(filter))
);

function AlgorithmBuildsTable() {
  const dataSource = useSelector(state => tableDataSelector(state));
  const dispatch = useDispatch();

  const onCancel = data => dispatch(cancelBuild(data));
  const onRerun = data => dispatch(rerunBuild(data));

  const expandedRowRender = record => {
    const algorithms = dataSource.filter(
      algorithm => algorithm.algorithmName === record.algorithmName
    );

    return (
      <CardRow>
        <InfinityTable
          rowKey={record => record.buildId}
          columns={nestedBuildsTableColumns({ onCancel, onRerun })}
          dataSource={algorithms}
          expandedRowRender={record => <JsonView jsonObject={record} />}
          pagination={algorithms.length > 10 ? { size: 'small' } : false}
        />
      </CardRow>
    );
  };

  const grouped = groupby(dataSource, 'algorithmName');
  const builds = Object.entries(grouped).map(([k, v]) => ({
    algorithmName: k,
    statuses: groupby(v, 'status')
  }));

  return (
    <InfinityTable
      rowKey={record => record.algorithmName}
      columns={buildsTableColumns({ dataSource })}
      dataSource={builds}
      expandedRowRender={expandedRowRender}
    />
  );
}

export default AlgorithmBuildsTable;
