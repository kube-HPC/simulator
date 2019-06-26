import React from 'react';
import { useSelector } from 'react-redux';

import driversTableColumns from 'components/UI/tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/common/json/JsonView.react';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import CardRow from 'components/common/CardRow.react';

export default function DriversTable() {
  const dataSource = useSelector(state => state.driverTable.dataSource);
  return (
    <DynamicTable
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
