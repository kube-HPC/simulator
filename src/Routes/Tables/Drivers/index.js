import React from 'react';
import { useSelector } from 'react-redux';

import { JsonView, Card } from 'components/common';
import { Table } from 'components';
import { selectors } from 'reducers';
import { useFilter } from 'hooks/useSearch';
import driversTableColumns from './DriversTableColumns.react';

export default function DriversTable() {
  const collection = useSelector(selectors.drivers.all);
  const filtered = useFilter(collection, ['podName', 'pipelineName', 'jobId']);

  return (
    <Table
      rowKey={record => record.driverId}
      columns={driversTableColumns()}
      dataSource={filtered}
      expandedRowRender={record => (
        <Card>
          <JsonView jsonObject={record} />
        </Card>
      )}
    />
  );
}
