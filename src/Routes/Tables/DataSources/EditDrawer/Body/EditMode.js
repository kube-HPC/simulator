import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { EditOutlined } from '@ant-design/icons';
import { Form, Alert, Input } from 'antd';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import { RightAlignedButton, PanelButton } from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import FileBrowser from './FileBrowser';
import { BottomPanel, Row, FileBrowserContainer } from './styles';
import DeleteModal from './DeleteModal';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 *
 * @typedef {import('./stratifier').FlatFile} FlatFile
 *
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 *
 * @typedef {import('./VersionSelect').DataSource} DataSource
 *
 * @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus
 */

/** @type {UploadFile[]} */
const initialState = [];

/**
 * @param {{
 *   dataSource: DataSource;
 *   onSubmit: function;
 *   form: import('antd/lib/form/Form').WrappedFormUtils;
 *   submittingStatus: FetchStatus;
 * }} props
 */

const EditMode = ({
  dataSource,
  onCreateVersion,
  form,
  submittingStatus,
  onDownload,
  onDelete,
}) => {
  const {
    isOn: isModalDisplayed,
    setOn: showModal,
    setOff: hideModal,
  } = useToggle();
  const [addedFiles, setAddedFiles] = useState(initialState);
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();

  const handleFileAdded = useCallback(
    file => {
      /* eslint-disable consistent-return, no-alert */
      if (!fileBrowserRef.current) return;
      const existingFile = fileBrowserRef.current
        .getCurrentDirContent()
        .find(item => item.name === file.name);

      if (
        !existingFile ||
        window.confirm(
          `file ${file.name} already exists would you like to override it?`
        )
      )
        return fileBrowserRef.current.addFile(file);
      setAddedFiles(current => current.filter(item => item.uid !== file.uid));
      /* eslint-enable consistent-return, no-alert */
    },
    [fileBrowserRef]
  );

  const { onChange, customRequest } = useDragger({
    onAddFile: handleFileAdded,
    setFileList: setAddedFiles,
  });

  const handleSubmit = useCallback(
    /** @param {import('react').SyntheticEvent} e */
    e => {
      e.preventDefault();
      if (!fileBrowserRef.current) return;
      form.validateFields((err, values) => {
        if (err) return null;
        return onCreateVersion({
          files: addedFiles,
          droppedFileIds: fileBrowserRef.current.getDeleteFiles(),
          mapping: fileBrowserRef.current.ls(),
          versionDescription: values.comment,
        });
      });
    },
    [fileBrowserRef, addedFiles, onCreateVersion, form]
  );

  useEffect(() => {
    setAddedFiles([]);
  }, [dataSource.id]);

  // drop a file from the added files list if deleted before upload
  const handleDelete = useCallback(
    /** @param {UploadFile[]} files */
    files => {
      const ids = new Set(files.map(file => file.id));
      setAddedFiles(state => state.filter(item => !ids.has(item.uid)));
    },
    [setAddedFiles]
  );

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={{ comment: '' }}
      style={{ display: 'contents' }}>
      <FileBrowserContainer>
        <FileBrowser
          files={dataSource.files}
          ref={fileBrowserRef}
          onDownload={onDownload}
          onDelete={handleDelete}
        />
      </FileBrowserContainer>
      <div>
        <Row>
          <UploadDragger
            onChange={onChange}
            fileList={[]}
            customRequest={customRequest}>
            <Alert
              message={
                addedFiles.length
                  ? addedFiles.length === 1
                    ? '1 file to upload'
                    : `${addedFiles.length} files to upload`
                  : 'please select at least one file to upload'
              }
              type={addedFiles.length ? 'info' : 'warning'}
              showIcon
            />
          </UploadDragger>
        </Row>
        <Row>
          <Form.Item
            name={['comment']}
            rules={[
              {
                required: true,
                message: 'please enter a comment describing the update',
              },
            ]}>
            <Input
              prefix={<EditOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="update comment"
              allowClear
            />
          </Form.Item>
        </Row>
      </div>
      <BottomPanel>
        <PanelButton type="danger" onClick={showModal}>
          Delete Datasource
        </PanelButton>
        <RightAlignedButton
          htmlType="submit"
          type="primary"
          loading={submittingStatus === 'PENDING'}>
          Update Version
        </RightAlignedButton>
      </BottomPanel>
      <DeleteModal
        isVisible={isModalDisplayed}
        onClose={hideModal}
        dataSource={dataSource}
        onAccept={onDelete}
        isInternalGit={dataSource.git.kind === 'internal'}
        isInternalStorage={dataSource.storage.kind === 'internal'}
      />
    </Form>
  );
};

EditMode.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    git: PropTypes.shape({
      kind: PropTypes.string.isRequired,
    }).isRequired,
    storage: PropTypes.shape({
      kind: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onCreateVersion: PropTypes.func.isRequired,
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
  submittingStatus: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
EditMode.defaultProps = {
  submittingStatus: null,
};

export default EditMode;
