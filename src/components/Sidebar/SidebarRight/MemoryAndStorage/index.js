import React from 'react';
import styled from 'styled-components';
import Bars from './Bars.react';
import useMetric from 'hooks/useMetric';
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

  return (
    <Root>
      <Storage />
      <Memory>
        <Header>Memory</Header>
        <Bars data={data} legend={legend} />
      </Memory>
    </Root>
  );
};

export default MemoryAndStorage;
