import React, { useMemo } from 'react';
import styled from 'styled-components';
import useDataSources from 'hooks/useDataSources';
import usePath from './usePath';
import GridItem from './GridItem';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding-top: 1em;
`;

const DataSourcesGrid = () => {
  const { dataSources } = useDataSources();
  const sortedDataSources = useMemo(
    () => dataSources.slice().sort((a, b) => b.id - a.id),
    [dataSources]
  );
  const { goTo } = usePath();
  return (
    <Grid>
      {sortedDataSources.map(dataSource => (
        <GridItem
          key={`datasource-${dataSource.id}`}
          dataSource={dataSource}
          goTo={goTo}
        />
      ))}
    </Grid>
  );
};

export default DataSourcesGrid;
