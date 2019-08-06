import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { getAlgorithmReadme } from 'actions/readme.action';

import DynamicTable from 'components/Layout/DynamicTable.react';
import algorithmsTableColumns from 'components/tables/Algorithms/AlgorithmsTableColumns.react';
import CardRow from 'components/common/CardRow.react';
import TabSwitcher from 'components/common/TabSwitcher.react';
import useAlgorithm from 'hooks/useAlgorithm.react';

const tableDataSelector = createSelector(
  state => state.algorithmTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.name.includes(filter))
);

// TODO: Same table as pipeline
function AlgorithmsTable() {
  const dataSource = useSelector(state => tableDataSelector(state));
  const readmeDefault = useSelector(state => state.algorithmReadme);
  const dispatch = useDispatch();

  return (
    <DynamicTable
      rowKey={record => record.name}
      columns={algorithmsTableColumns({ ...useAlgorithm(), readmeDefault })}
      dataSource={dataSource}
      onExpand={(expanded, record) => {
        if (expanded) dispatch(getAlgorithmReadme(record.name));
      }}
      expandedRowRender={record => (
        <CardRow>
          <TabSwitcher
            jsonObject={record}
            readme={
              readmeDefault &&
              readmeDefault[record.key] &&
              readmeDefault[record.key].readme &&
              readmeDefault[record.key].readme.readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default AlgorithmsTable;
