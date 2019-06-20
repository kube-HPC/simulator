import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { getAlgorithmReadme } from 'actions/readme.action';
import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';

import AlgorithmTabSwitcher from 'components/UI/tables/Algorithms/AlgorithmTabSwitcher.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import algorithmsTableColumns from 'components/UI/tables/Algorithms/AlgorithmsTableColumns.react';
import CardRow from 'components/containers/CardRow.react';
import { stringify } from 'utils/string';

const tableDataSelector = createSelector(
  state => state.algorithmTable.dataSource,
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.name.includes(filter))
);

function AlgorithmsTable() {
  const dataSource = useSelector(state => tableDataSelector(state));
  const algorithmReadme = useSelector(state => state.algorithmReadme);
  const dispatch = useDispatch();

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('payload', stringify(data));
    dispatch(applyAlgorithm(formData));
  };
  const onDelete = data => dispatch(deleteAlgorithm(data));

  return (
    <InfinityTable
      rowKey={record => record.name}
      columns={algorithmsTableColumns({ onSubmit, onDelete })}
      dataSource={dataSource.asMutable()}
      onExpand={(_, record) => dispatch(getAlgorithmReadme(record.key))}
      expandedRowRender={record => (
        <CardRow>
          <AlgorithmTabSwitcher
            algorithmDetails={record}
            readme={
              algorithmReadme &&
              algorithmReadme[record.key] &&
              algorithmReadme[record.key].readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default AlgorithmsTable;
