import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Form, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createSnapshot } from 'actions/dataSources';
import { notification } from 'utils';
import client from '../../../../../client';
import FileBrowser from './FileBrowser';
import { BottomPanel, Row, FileBrowserContainer, RightButton } from './styles';
import './styles.css';

/**
 * @typedef {import('reducers/dataSources/datasource').FileMeta} FileMeta
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('.').ExtendedDataSource} ExtendedDataSource
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
 *   dataSource: ExtendedDataSource;
 *   onDownload: function;
 *   form: import('antd/lib/form/Form').WrappedFormUtils;
 * }} props
 */
const Create = ({ dataSource, form, onDownload }) => {
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();
  const dispatch = useDispatch();
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

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      form.validateFields((err, values) =>
        err
          ? null
          : dispatch(
              createSnapshot({
                dataSourceId: dataSource.id,
                query: values.query,
              })
            )
      );
      return null;
    },
    [dispatch, dataSource, form]
  );

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

Create.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSnapshot: PropTypes.bool,
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default Form.create({ comment: '' })(Create);
