import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import groupby from 'lodash/groupBy';

import { cancelBuild, rerunBuild } from 'actions/builds.action';

import {
  buildsTableColumns,
  nestedBuildsTableColumns
} from 'components/Tables/AlgorithmBuilds/AlgorithmBuildsTableColumns.react';

import Table from 'components/Table/Table.react';
import JsonView from 'components/common/Json/JsonView.react';
import Card from 'components/common/Card.react';

const tableDataSelector = createSelector(
  state => state.algorithmBuildsTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) => dataSource && dataSource.filter(build => build.buildId.includes(filter))
);

function AlgorithmBuildsTable() {
  const dataSource = useSelector(tableDataSelector);
  const dispatch = useDispatch();

  const onCancel = data => dispatch(cancelBuild(data));
  const onRerun = data => dispatch(rerunBuild(data));

  const expandedRowRender = record => {
    const algorithmsDataSource = dataSource.filter(
      algorithm => algorithm.algorithmName === record.algorithmName
    );

    return (
      <Card>
        <Table
          isInner
          rowKey={record => record.buildId}
          columns={nestedBuildsTableColumns({ onCancel, onRerun })}
          dataSource={algorithmsDataSource}
          expandedRowRender={record => (
            <Card>
              <JsonView jsonObject={record} collapsed="1" />
            </Card>
          )}
        />
      </Card>
    );
  };

  const grouped = groupby(dataSource, 'algorithmName');
  const builds = Object.entries(grouped).map(([k, v]) => ({
    algorithmName: k,
    statuses: groupby(v, 'status')
  }));

  return (
    <Table
      rowKey={record => record.algorithmName}
      columns={buildsTableColumns({ dataSource })}
      dataSource={builds}
      expandedRowRender={expandedRowRender}
    />
  );
}

export default AlgorithmBuildsTable;
