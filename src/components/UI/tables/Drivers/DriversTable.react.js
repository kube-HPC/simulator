import React from 'react';
import { useSelector } from 'react-redux';

import driversTableColumns from 'components/UI/tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/containers/json/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import CardRow from 'components/containers/CardRow.react';

export default function DriversTable() {
  const dataSource = useSelector(state => state.driverTable.dataSource);
  return (
    <InfinityTable
      rowKey={record => record.driverId}
      columns={driversTableColumns()}
      dataSource={dataSource}
      expandedRowRender={record => (
        <CardRow>
          <JsonView jsonObject={record} />
        </CardRow>
      )}
    />
  );
}
