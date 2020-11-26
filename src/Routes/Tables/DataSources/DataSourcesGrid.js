import React, { useMemo } from 'react';
import { Card, Tooltip } from 'antd';
import styled from 'styled-components';
import useDataSources from 'hooks/useDataSources';
import prettyBytes from 'pretty-bytes';
import { COLOR, COLOR_LAYOUT } from 'styles/colors';
import { copyToClipboard } from 'utils';
import Tag from './Tag';
import EmptyDataSourceMessage from './EmptyDataSourceMessage';
import { FileIcon, fileTypes } from './FileIcons';
import usePath from './usePath';

const SummaryBar = styled.div`
  display: flex;
  margin-top: auto;
  flex-wrap: wrap;
`;

const DataSourceName = styled.span`
  font: inherit;
`;

const DataSourceVersionId = styled.span`
  font: inherit;
  font-size: 0.75em;
  color: ${COLOR.darkGrey};
  margin-left: auto;
  border: 1px solid ${COLOR_LAYOUT.border};
  border-radius: 0.5em;
  padding: 0.5em 1ch;
`;

const Header = styled.h3`
  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding-top: 1em;
`;

const GridItem = styled(Card.Grid)`
  max-width: calc(25% - 1em);
  min-width: 40ch;
  margin: 0 auto;
  min-height: 15em;
  display: flex;
  flex-direction: column;
  margin: 0 0.5em;
  margin-bottom: 1em;
  border-radius: 0.5em;
  cursor: pointer;
  padding: 1em;
  user-select: none;
`;

const FileTypesList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 1em 0;
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
          onDoubleClick={() => goTo.edit({ nextDataSourceId: dataSource.id })}
          hoverable>
          <Header>
            <DataSourceName>{dataSource.name}</DataSourceName>
            <Tooltip title="copy to clipboard" placement="bottom">
              <DataSourceVersionId
                onClick={() => copyToClipboard(dataSource.id)}>
                {dataSource.id}
              </DataSourceVersionId>
            </Tooltip>
          </Header>
          <p>{dataSource.versionDescription}</p>
          <FileTypesList>
            {dataSource.fileTypes.map(type => (
              <Tooltip
                title={type}
                key={`dataSource-${dataSource.id}-icon-${type}`}>
                <FileIcon>
                  {fileTypes[type]?.name ?? fileTypes.default.name}
                </FileIcon>
              </Tooltip>
            ))}
          </FileTypesList>
          {dataSource.filesCount === 0 ? (
            <EmptyDataSourceMessage />
          ) : (
            <SummaryBar>
              <Tag title="# of files:" value={dataSource.filesCount} />
              <Tag
                title="avg file size:"
                value={prettyBytes(dataSource.avgFileSize)}
              />
              <Tag
                title="total size:"
                value={prettyBytes(dataSource.totalSize)}
              />
            </SummaryBar>
          )}
        </GridItem>
      ))}
    </Grid>
  );
};

export default DataSourcesGrid;
