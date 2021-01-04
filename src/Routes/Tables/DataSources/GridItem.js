import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import { Card, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';
import styled from 'styled-components';
import { COLOR, COLOR_LAYOUT } from 'styles/colors';
import { FileIcon, fileTypes } from './FileIcons';
import Tag from './Tag';
import EmptyDataSourceMessage from './EmptyDataSourceMessage';

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

const FileTypesList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 1em 0;
`;

const GridItemCard = styled(Card.Grid)`
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

const SummaryBar = styled.div`
  display: flex;
  margin-top: auto;
  flex-wrap: wrap;
`;

const GridItem = ({ goTo, dataSource }) => {
  const handleDoubleClick = useCallback(
    () => goTo.edit({ nextDataSourceId: dataSource.id }),
    [goTo, dataSource.id]
  );

  const handleCopy = useCallback(() => copyToClipboard(dataSource.id), [
    dataSource,
  ]);

  return (
    <GridItemCard
      key={`datasource-${dataSource.id}`}
      onDoubleClick={handleDoubleClick}
      hoverable>
      <Header>
        <DataSourceName>{dataSource.name}</DataSourceName>
        <Tooltip title="copy to clipboard" placement="bottom">
          <DataSourceVersionId onClick={handleCopy}>
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
            <FileIcon data-category={fileTypes[type]?.category}>
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
          <Tag title="total size:" value={prettyBytes(dataSource.totalSize)} />
        </SummaryBar>
      )}
    </GridItemCard>
  );
};
GridItem.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    filesCount: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    versionDescription: PropTypes.string.isRequired,
    fileTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    avgFileSize: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
  }).isRequired,
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
  }).isRequired,
};
export default GridItem;
