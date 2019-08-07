import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAlgorithmReadme } from 'actions/readme.action';

import DynamicTable from 'components/Layout/DynamicTable.react';
import algorithmsTableColumns from 'components/tables/Algorithms/AlgorithmsTableColumns.react';
import CardRow from 'components/common/CardRow.react';
import TabSwitcher from 'components/common/TabSwitcher.react';
import useAlgorithm from 'hooks/useAlgorithm.react';
import { tableDataSelector } from 'utils/hooks';
import { STATE_SOURCES } from 'reducers/root.reducer';

const dataSelector = tableDataSelector(
  STATE_SOURCES.ALGORITHM_TABLE,
  filter => record => record.name.includes(filter)
);

function AlgorithmsTable() {
  const dataSource = useSelector(dataSelector);
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
      expandedRowRender={record => {
        // debugger;
        return (
          <CardRow>
            <TabSwitcher
              jsonObject={record}
              readme={
                readmeDefault &&
                readmeDefault[record.name] &&
                readmeDefault[record.name].readme
              }
            />
          </CardRow>
        );
      }}
    />
  );
}

export default AlgorithmsTable;
