import React from 'react';
import { useSelector } from 'react-redux';

import driversTableColumns from 'components/UI/tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/containers/json/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import RowCard from 'components/containers/RowCard.react';

export default function DriversTable(props) {
  const dataSource = useSelector(state => state.driverTable.dataSource);
  return (
    <InfinityTable
      columns={driversTableColumns(props)}
      dataSource={dataSource}
      expandedRowRender={record => (
        <RowCard title="Full details">
          <JsonView jsonObject={record} />
        </RowCard>
      )}
    />
  );
}
