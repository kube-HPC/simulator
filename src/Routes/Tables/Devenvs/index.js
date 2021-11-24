import React from 'react';
import { Table } from 'components';
import { useDevenvs } from 'hooks';
import columns from './columns';
import usePath from './usePath';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  const { collection } = useDevenvs();
  const { goTo } = usePath();

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  return (
    <Table
      onRow={onRow}
      rowKey={rowKey}
      columns={columns}
      dataSource={collection}
      expandIcon={false}
    />
  );
};

export default React.memo(AlgorithmsTable);
