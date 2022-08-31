import React, { useMemo } from 'react';
import styled from 'styled-components';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { Button } from 'antd';
// import { useActions } from 'hooks';
// import { COLOR_LAYOUT } from 'styles/colors';
// import useDataSources from 'hooks/dataSources/useDataSources';
import useDataSources from 'hooks/graphql/DataSources/useDataSource';
import usePath from './usePath';
import GridItem from './GridItem';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 1em;
  position: relative;
`;
/*
const FailedMessageContainer = styled.div`
  position: absolute;
  top: 1.5em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-radius: 0.5em;
  background: white;
  border: 1px solid ${COLOR_LAYOUT.border};
  padding: 0.75em 1.5ch;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
`;

const FailedMessageContent = styled.span`
  margin: 0 1ch;
`;
*/
/* const FailedMessage = () => {
  const { retryFetchDataSources } = useActions();
  return (
    <FailedMessageContainer>
      <ExclamationCircleOutlined style={{ color: COLOR.red }} />
      <FailedMessageContent>
        Failed fetching dataSources collection
      </FailedMessageContent>
      <Button type="primary" onClick={retryFetchDataSources}>
        retry
      </Button>
    </FailedMessageContainer>
  );
}; */

const DataSourcesGrid = () => {
  const { dataSources } = useDataSources();

  const sortedDataSources = useMemo(
    () => dataSources.slice().sort((a, b) => b.id - a.id),
    [dataSources]
  );
  const { goTo } = usePath();
  return (
    <Grid>
      {/* status === 'FAIL' ? <FailedMessage /> : null */}
      {sortedDataSources.map(dataSource => (
        <GridItem
          key={`datasource-${dataSource.name}-${dataSource.id}`}
          dataSource={dataSource}
          goTo={goTo}
        />
      ))}
    </Grid>
  );
};

export default DataSourcesGrid;
