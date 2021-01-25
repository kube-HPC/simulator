import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Typography, Upload } from 'antd';
import styled from 'styled-components';
import { COLOR } from 'styles';
import { notification } from 'utils';

const { Text } = Typography;

const DraggerContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const DraggerDescription = styled.p`
  margin-top: 0.5em !important;
  margin-bottom: 1em !important;
  display: flex;
  flex-direction: column;
`;

const toStatusMessage = fileName => ({
  done: `${fileName} uploaded successfully`,
  error: `${fileName} upload failed`,
  removed: `File ${fileName} removed`,
});

const STATUS_TYPE = {
  done: notification.TYPES.SUCCESS,
  error: notification.TYPES.ERROR,
  removed: notification.TYPES.INFO,
};

export const useDragger = ({ onAddFile, onDropFile, setFileList }) => {
  const onChange = useCallback(
    /** @param {{ file: import('antd/lib/upload/interface').UploadFile }} info */
    ({ file }) => {
      const { status: fileStatus, name } = file;
      if (fileStatus === 'error') {
        notification({
          message: toStatusMessage(name)[fileStatus],
          type: STATUS_TYPE[fileStatus],
        });
      }
      // 'uploading' status has more content than 'done',
      // we are not really uploading the file here
      // it has no real meaning
      if (fileStatus === 'uploading') {
        setFileList &&
          setFileList(list => list.concat({ ...file, status: 'done' }));
        onAddFile && onAddFile({ ...file, status: 'done' });
      }
      if (fileStatus === 'removed') {
        setFileList && setFileList(list => list.filter(item => item !== file));
        onDropFile && onDropFile(file);
      }
    },
    [onDropFile, onAddFile, setFileList]
  );

  const customRequest = useCallback(
    /** @param {import('antd/lib/upload/interface').RcCustomRequestOptions} props */
    ({ file, onSuccess }) => {
      onSuccess(file.name);
    },
    []
  );

  return { onChange, customRequest };
};

const FileDragger = ({
  fileList,
  customRequest,
  onChange,
  children,
  supportedFiles,
  accept,
}) => (
  <Upload.Dragger
    multiple
    name="files"
    accept={accept}
    customRequest={customRequest}
    fileList={fileList}
    onChange={onChange}>
    <DraggerContent>
      <Icon type="inbox" style={{ fontSize: 50, color: COLOR.blueLight }} />
      <DraggerDescription>
        <Text>Click or drag files to upload</Text>
        <Text type="secondary">
          {supportedFiles.length > 0
            ? `supports ${supportedFiles.join(' | ')}`
            : 'all file types are supported'}
        </Text>
      </DraggerDescription>
      {children}
    </DraggerContent>
  </Upload.Dragger>
);

FileDragger.propTypes = {
  supportedFiles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  // eslint-disable-next-line
  fileList: PropTypes.array.isRequired,
  customRequest: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
};
FileDragger.defaultProps = {
  supportedFiles: [],
  accept: undefined,
};
export default FileDragger;
