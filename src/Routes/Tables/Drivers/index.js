import React from 'react';
import { useSelector } from 'react-redux';

import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/tableSelector';
import { JsonView, Card } from 'components/common';
import { Table } from 'components';
import driversTableColumns from './DriversTableColumns.react';

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
