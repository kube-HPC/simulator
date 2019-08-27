import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import groupby from 'lodash/groupBy';

import { cancelBuild, rerunBuild } from 'actions/builds.action';

import { buildsTableColumns, nestedBuildsTableColumns } from './AlgorithmBuildsTableColumns.react';

import { Card, JsonView } from 'components/common';
import { Table } from 'components';
import { tableFilterSelector } from 'utils/hooks';
import { LEFT_SIDEBAR_NAMES } from 'const';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.BUILDS);

function AlgorithmBuildsTable() {
  const dataSource = useSelector(dataSelector);
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
            <Card isMargin>
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
