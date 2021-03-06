import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import FileBrowser from './FileBrowser';
import { Bold, FileBrowserContainer, FormContainer } from './styles';
import './styles.css';
import ErrorPage from './Error';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 */

const QueryPreview = styled.p`
  border: 1px solid ${COLOR_LAYOUT.border};
  border-radius: 4px;
  height: 100%;
  padding: 0.5em 1ch;
`;

const Header = styled.h3`
  text-transform: capitalize;
  margin-top: 1em;
`;

/** @param {{ activeSnapshot: Snapshot }} props */
const PreviewSnapshot = ({ activeSnapshot, onDownload, snapshotName }) => {
  /** @type {RefContent} */
  const fileBrowserRef = useRef();
  if (!activeSnapshot)
    return (
      <ErrorPage>
        could not find snapshot <Bold>{snapshotName}</Bold>
        <span style={{ display: 'block' }}>
          Please select another version or snapshot from the dropdown above
        </span>
      </ErrorPage>
    );
  return (
    <div style={{ display: 'contents' }}>
      <FileBrowserContainer>
        <FileBrowser
          files={activeSnapshot.filteredFilesList}
          onDownload={onDownload}
          ref={fileBrowserRef}
        />
      </FileBrowserContainer>
      <FormContainer>
        <Header>Query</Header>
        <QueryPreview>{activeSnapshot.query}</QueryPreview>
      </FormContainer>
    </div>
  );
};

PreviewSnapshot.propTypes = {
  activeSnapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    filteredFilesList: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSnapshot: PropTypes.bool,
    query: PropTypes.string,
  }),
  onDownload: PropTypes.func.isRequired,
  snapshotName: PropTypes.string.isRequired,
};

PreviewSnapshot.defaultProps = {
  activeSnapshot: null,
};

export default PreviewSnapshot;
