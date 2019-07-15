import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { getAlgorithmReadme, postAlgorithmReadme } from 'actions/readme.action';
import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';

import AlgorithmTabSwitcher from 'components/UI/tables/Algorithms/AlgorithmTabSwitcher.react';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import algorithmsTableColumns from 'components/UI/tables/Algorithms/AlgorithmsTableColumns.react';
import CardRow from 'components/common/CardRow.react';
import { stringify } from 'utils/string';

const tableDataSelector = createSelector(
  state => state.algorithmTable.dataSource.asMutable(),
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

  const onSubmitReadme = useCallback(
    (name, readme) => dispatch(postAlgorithmReadme(name, readme)),
    [dispatch]
  );

  return (
    <DynamicTable
      rowKey={record => record.name}
      columns={algorithmsTableColumns({ onSubmit, onDelete })}
      dataSource={dataSource}
      onExpand={(_, record) => dispatch(getAlgorithmReadme(record.name))}
      expandedRowRender={record => (
        <CardRow>
          <AlgorithmTabSwitcher
            algorithmDetails={record}
            onSubmit={onSubmitReadme}
            readme={
              algorithmReadme &&
              algorithmReadme[record.key] &&
              algorithmReadme[record.key].readme &&
              algorithmReadme[record.key].readme.readme
            }
          />
        </CardRow>
      )}
    />
  );
}

export default AlgorithmsTable;
