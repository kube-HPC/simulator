import React from 'react';
import styled from 'styled-components';
import Bars from './Bars.react';
import useMetric from 'hooks/useMetric';
import { Empty } from 'antd';
import { useStorage } from 'hooks';
import Storage from './Storage';
import { Header } from './styles';

const Root = styled.div`
  font-size: 20px;
  padding: 1em 4ch;
`;

const Memory = styled.div`
  height: 70vh;
`;

const MemoryAndStorage = () => {
  const { data, legend } = useMetric('mem');
  const { storage } = useStorage();
  return (
    <Root>
      {storage.size ? (
        <Storage storage={storage} />
      ) : (
        <Empty description="No Storage data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {data.length > 0 ? (
        <Memory>
          <Header>Memory</Header>
          <Bars data={data} legend={legend} />
        </Memory>
      ) : (
        <Empty description="No Memory data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Root>
  );
};

export default MemoryAndStorage;
