import React, { useState, useReducer } from 'react';
import { Table } from 'components';
import { useAlgorithm } from 'hooks';

import getAlgorithmColumns from './getAlgorithmColumns.react';
import AlgorithmsTabs from './Tabs/AlgorithmsTabs.react';
import DrawerEditor from 'components/Drawer/DrawerEditor/DrawerEditor.react';
import { Typography } from 'antd';
import { stringify } from 'utils';

const { Paragraph, Title, Text } = Typography;

const title = (
  <>
    <Title level={2}>Edit Algorithm</Title>
    <Paragraph>
      Edit algorithm and <Text code>Submit</Text> the changes.
    </Paragraph>
  </>
);

const AlgorithmsTable = () => {
  const { dataSource, onSubmit, ...actions } = useAlgorithm();
  const expandedRowRender = record => <AlgorithmsTabs record={record} />;
  const [visible, toggle] = useReducer(prev => !prev, false);
  const [algorithm, setAlgorithm] = useState(undefined);

  return (
    <>
      <DrawerEditor
        visible={visible}
        title={title}
        value={stringify(algorithm)}
        onClose={toggle}
        onSubmit={onSubmit}
      />
      <Table
        rowKey={({ name }) => name}
        columns={getAlgorithmColumns({ toggle, setAlgorithm, ...actions })}
        dataSource={dataSource}
        expandedRowRender={expandedRowRender}
      />
    </>
  );
};

export default AlgorithmsTable;
