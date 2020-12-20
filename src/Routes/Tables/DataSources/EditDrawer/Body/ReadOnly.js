import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { BottomPanel } from 'components/Drawer';
import { FileBrowserContainer, RightButton } from './styles';
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
      <FileBrowserContainer>
        <FileBrowser isReadOnly files={dataSource.files} ref={fileBrowserRef} />
      </FileBrowserContainer>
      <BottomPanel>
        <RightButton type="primary" onClick={onSelectVersion}>
          Select Version
        </RightButton>
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
