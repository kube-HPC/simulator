import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import FileBrowser from './FileBrowser';
import { Bold, FileBrowserContainer, FormContainer } from './styles';
import './styles.css';
import ErrorPage from './Error';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 *
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
  const [isErrorTimer, setIsErrorTimer] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsErrorTimer(true);
    }, 10000);
  }, []);
  // could not find snapshot
  if (!activeSnapshot) {
    return (
      <>
        <Row
          type="flex"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '120px',
          }}>
          <Col>
            <Spin
              indicator={LoadingOutlined}
              style={{
                verticalAlign: 'middle',
              }}
            />
          </Col>
          <Col style={{ marginLeft: '20px' }}>
            <h3>
              snapshot <b>{snapshotName}</b> loading
            </h3>
          </Col>
        </Row>

        {isErrorTimer && (
          <ErrorPage>
            could not find snapshot <Bold>{snapshotName}</Bold>
            <span style={{ display: 'block' }}>
              Please select another version or snapshot from the dropdown above
            </span>
          </ErrorPage>
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'contents' }}>
      <FileBrowserContainer>
        <FileBrowser
          isReadOnly
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
