import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Form, Button } from 'antd';
import styled from 'styled-components';
import { notification } from 'utils';
import client from './../../../../../client';
import FileBrowser from './FileBrowser';
import { BottomPanel, Row, FileBrowserContainer, RightButton } from './styles';
import './styles.css';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 * @typedef {import('./../../../../../reducers/dataSources/datasource').DataSource} DataSource
 * @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus
 * @typedef {import('reducers/dataSources/datasource').FileMeta} FileMeta
 */

/**
 * @param {{
 *   dataSource: DataSource;
 *   onSubmit: function;
 *   form: import('antd/lib/form/Form').WrappedFormUtils;
 *   submittingStatus: FetchStatus;
 * }} props
 */

const InnerContainer = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FormItem = styled(Form.Item)`
  height: 100%;
`;

/**
 * @param {{
 *   dataSource: DataSource;
 *   onSubmit: function;
 *   form: import('antd/lib/form/Form').WrappedFormUtils;
 * }} props
 */
const QueryMode = ({ dataSource, form, onDownload }) => {
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();

  const [previewFiles, setPreviewFiles] = useState([]);
  const [showQuery, setShowQuery] = useState(false);

  const handleToggleQuery = useCallback(() => setShowQuery(state => !state), [
    setShowQuery,
  ]);

  const handleTryQuery = useCallback(async () => {
    form.validateFields(['query'], async (err, values) => {
      if (err) return null;
      try {
        /** @type {import('axios').AxiosResponse<FileMeta[]>} */
        const response = await client.post(
          `/datasource/id/${dataSource.id}/snapshot/preview`,
          { query: values.query }
        );
        setShowQuery(true);
        return setPreviewFiles(response.data);
      } catch (e) {
        return notification({ message: e.message, type: 'error' });
      }
    });
  }, [dataSource, form, setPreviewFiles]);

  const filteredFiles = useMemo(() => {
    return showQuery ? previewFiles : dataSource.files;
  }, [showQuery, previewFiles, dataSource]);

  // const handleFileAdded = useCallback(
  //   file => {
  //     /* eslint-disable consistent-return, no-alert */
  //     if (!fileBrowserRef.current) return;
  //     const existingFile = fileBrowserRef.current
  //       .getCurrentDirContent()
  //       .find(item => item.name === file.name);

  //     if (
  //       !existingFile ||
  //       window.confirm(
  //         `file ${file.name} already exists would you like to override it?`
  //       )
  //     )
  //       return fileBrowserRef.current.addFile(file);
  //     setAddedFiles(current => current.filter(item => item.uid !== file.uid));
  //     /* eslint-enable consistent-return, no-alert */
  //   },
  //   [fileBrowserRef]
  // );

  // const handleFileDropped = useCallback(
  //   file => {
  //     fileBrowserRef.current.dropFile(file.uid);
  //   },
  //   [fileBrowserRef]
  // );

  // const handleFileBrowserDelete = useCallback(
  //   /** @param {FlatFile[]} files */
  //   files => {
  //     const fileIds = new Set(files.map(file => file.id));
  //     return setAddedFiles(state =>
  //       state.filter(file => !fileIds.has(file.uid))
  //     );
  //   },
  //   [setAddedFiles]
  // );

  // const { onChange, customRequest } = useDragger({
  //   onAddFile: handleFileAdded,
  //   onDropFile: handleFileDropped,
  //   setFileList: setAddedFiles,
  // });

  // const handleSubmit = useCallback(
  //   /** @param {import('react').SyntheticEvent} e */
  //   e => {
  //     e.preventDefault();
  //     if (!fileBrowserRef.current) return;
  //     form.validateFields((err, values) => {
  //       if (err) return null;
  //       return onCreateVersion({
  //         files: addedFiles,
  //         droppedFileIds: fileBrowserRef.current.getDeleteFiles(),
  //         mapping: fileBrowserRef.current.ls(),
  //         versionDescription: values.comment,
  //       });
  //     });
  //   },
  //   [fileBrowserRef, addedFiles, onCreateVersion, form]
  // );

  // useEffect(() => {
  //   setAddedFiles([]);
  // }, [dataSource.id]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log(values);
      if (err) return null;
      return null;
    });
    return null;
  };
  const submittingStatus = 'null';
  return (
    <Form onSubmit={handleSubmit} style={{ display: 'contents' }}>
      <FileBrowserContainer>
        <FileBrowser
          files={filteredFiles}
          ref={fileBrowserRef}
          onDownload={onDownload}
        />
      </FileBrowserContainer>
      <InnerContainer>
        <Row style={{ flex: 1 }}>
          <FormItem
            style={{ display: 'contents' }}
            wrapperCol={{ style: { display: 'contents' } }}>
            {form.getFieldDecorator('query', {
              rules: [{ message: 'please enter a query', required: true }],
            })(<Input.TextArea placeholder="Query" allowClear />)}
          </FormItem>
        </Row>
        <Row>
          <Form.Item>
            {form.getFieldDecorator('snapshotName', {
              rules: [
                {
                  message: 'please enter a snapshot name',
                  max: 25,
                  required: true,
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="camera" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Snapshot Name"
                allowClear
              />
            )}
          </Form.Item>
        </Row>
      </InnerContainer>
      <BottomPanel>
        <Button type="secondary" onClick={handleTryQuery}>
          Preview Query
        </Button>
        {showQuery || previewFiles.length > 0 ? (
          <Button
            type="dashed"
            onClick={handleToggleQuery}
            style={{ marginLeft: '2ch' }}>
            {showQuery ? 'Show All' : 'Apply Preview'}
          </Button>
        ) : null}
        <RightButton
          htmlType="submit"
          type="primary"
          loading={submittingStatus === 'PENDING'}>
          Create snapshot
        </RightButton>
      </BottomPanel>
    </Form>
  );
};

QueryMode.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,

  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,

  onDownload: PropTypes.func.isRequired,
};

export default Form.create({ comment: '' })(QueryMode);
