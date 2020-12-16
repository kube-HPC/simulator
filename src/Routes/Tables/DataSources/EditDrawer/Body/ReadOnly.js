import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { BottomPanel, FileBrowserContainer } from './styles';

import FileBrowser from './FileBrowser';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

const ReadOnly = ({ dataSource, onSelectVersion }) => {
  const fileBrowserRef = useRef();
  return (
    <>
      <div>
        <FileBrowserContainer>
          <FileBrowser
            isReadOnly
            files={dataSource.files}
            ref={fileBrowserRef}
          />
        </FileBrowserContainer>
      </div>
      <BottomPanel>
        <Button type="primary" onClick={onSelectVersion}>
          Select Version
        </Button>
      </BottomPanel>
    </>
  );
};

ReadOnly.propTypes = {
  dataSource: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onSelectVersion: PropTypes.func.isRequired,
};

export default ReadOnly;
