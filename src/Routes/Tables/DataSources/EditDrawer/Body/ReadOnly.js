import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { BottomPanel, RightAlignedButton } from 'components/Drawer';
import { FileBrowserContainer } from './styles';
import FileBrowser from './FileBrowser';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

const ReadOnly = ({ dataSource, onDownload }) => {
  const fileBrowserRef = useRef();
  return (
    <>
      <FileBrowserContainer>
        <FileBrowser
          isReadOnly
          files={dataSource.files}
          ref={fileBrowserRef}
          onDownload={onDownload}
        />
      </FileBrowserContainer>
      <BottomPanel>
        <RightAlignedButton type="primary" disabled>
          read only
        </RightAlignedButton>
      </BottomPanel>
    </>
  );
};

ReadOnly.propTypes = {
  dataSource: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default ReadOnly;
