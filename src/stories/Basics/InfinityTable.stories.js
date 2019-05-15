import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { InfinityTable } from 'antd-table-infinity';
import { Spin } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
];

const loadMoreContent = () => (
  <div
    style={{
      textAlign: 'center',
      paddingTop: 40,
      paddingBottom: 40,
      border: '1px solid #e8e8e8'
    }}
  >
    <Spin tip="Loading..." />
  </div>
);

let k = 0;
function InfinityContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    console.log('loading');
    debugger;
    setLoading(true);
    setTimeout(() => {
      for (let i = 0; i < 40; i++, k++) {
        data.push({
          key: k,
          name: `Edward King ${k}`,
          age: 32,
          address: `London, Park Lane no. ${k}`
        });
      }
      setData([...data]);
      setLoading(false);
    }, 3000);
  };
  return (
    <InfinityTable
      key="InfinityTable"
      loading={loading}
      onFetch={handleFetch}
      columns={columns}
      dataSource={data}
      loadingIndicator={loadMoreContent()}
      pageSize={30}
      scroll={{ y: '80vh' }}
      bordered
      debug
    />
  );
}

storiesOf('Basics|InfinityTable', module).add('Default', () => (
  <InfinityContainer />
));
