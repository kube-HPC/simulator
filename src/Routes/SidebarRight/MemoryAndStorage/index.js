import React from 'react';
import styled from 'styled-components';
import { Empty } from 'antd';
import { useStorage, useMetric } from 'hooks/graphql';
import Bars from './Bars.react';
import Storage from './Storage';
import { Header } from './styles';
import BarChartMonitors from './../BarChartMonitors.react';

const Root = styled.div`
  // font-size: 20px;
  // padding: 0 4ch;
  height: 95vh;
`;

const Memory = styled.div`
  height: 55%;
`;

const MemoryAndStorage = () => {
  const { data, legend } = useMetric('mem');
  const { storage } = useStorage();
  return (
    <Root>
      {data.length > 0 ? (
        <Memory>
          {false && <Header>Memory</Header> && (
            <Bars data={data} legend={legend} />
          )}
          <BarChartMonitors metric="mem" />
        </Memory>
      ) : (
        <Empty
          description="No Memory data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
      {storage.size ? (
        <Storage storage={storage} />
      ) : (
        <Empty
          description="No Storage data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Root>
  );
};

export default MemoryAndStorage;
