import React from 'react';
import { useSelector } from 'react-redux';

import driversTableColumns from 'components/Tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/common/json/JsonView.react';
import Table from 'components/Table/Table.react';
import CardRow from 'components/common/CardRow.react';
import { createSelector } from 'reselect';

const tableDataSelector = createSelector(
  state => state.driverTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(driver => driver.driverId.includes(filter))
);

export default function DriversTable() {
  const dataSource = useSelector(tableDataSelector);
  return (
    <Table
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
