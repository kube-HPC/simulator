import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Input, Icon, Form } from 'antd';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import FileBrowser from './FileBrowser';
import { BottomPanel, Row, FileBrowserContainer } from './styles';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 * @typedef {import('./VersionSelect').DataSource} DataSource
 */

/** @type {UploadFile[]} */
const initialState = [];

/**
 * @param {{
 *   dataSource: DataSource;
 *   onSubmit: function;
 *   form: import('antd/lib/form/Form').WrappedFormUtils;
 * }} props
 */

const Body = ({ dataSource, onCreateVersion, form }) => {
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

  const handleFileDropped = useCallback(
    file => {
      fileBrowserRef.current.dropFile(file.uid);
    },
    [fileBrowserRef]
  );

  const handleFileBrowserDelete = useCallback(
    /** @param {FlatFile[]} files */
    files => {
      const fileIds = new Set(files.map(file => file.id));
      return setAddedFiles(state =>
        state.filter(file => !fileIds.has(file.uid))
      );
    },
    [setAddedFiles]
  );

  const { onChange, customRequest } = useDragger({
    onAddFile: handleFileAdded,
    onDropFile: handleFileDropped,
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

  return (
    <Form onSubmit={handleSubmit} style={{ display: 'contents' }}>
      <FileBrowserContainer>
        <FileBrowser
          files={dataSource.files}
          ref={fileBrowserRef}
          onDelete={handleFileBrowserDelete}
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
          <Form.Item>
            {form.getFieldDecorator('comment', {
              rules: [
                {
                  required: true,
                  message: 'please enter a comment describing the update',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="update comment"
                allowClear
              />
            )}
          </Form.Item>
        </Row>
      </div>
      <BottomPanel>
        <Button htmlType="submit" type="primary">
          Update Version
        </Button>
      </BottomPanel>
    </Form>
  );
};

Body.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onCreateVersion: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form.create({ comment: '' })(Body);
