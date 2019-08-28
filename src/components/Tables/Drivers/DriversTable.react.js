import React from 'react';
import { useSelector } from 'react-redux';

import driversTableColumns from 'components/Tables/Drivers/DriversTableColumns.react';
import JsonView from 'components/common/Json/JsonView.react';
import Table from 'components/Table/Table.react';
import Card from 'components/common/Card.react';
import {} from 'utils';
import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.DRIVERS);

export default function DriversTable() {
  const dataSource = useSelector(dataSelector);
  return (
    <Table
      rowKey={record => record.driverId}
      columns={driversTableColumns()}
      dataSource={dataSource}
      expandedRowRender={record => (
        <Card>
          <JsonView jsonObject={record} />
        </Card>
      )}
    />
  );
}
