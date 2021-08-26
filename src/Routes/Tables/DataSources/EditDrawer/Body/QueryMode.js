import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CameraOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { snapshotsActions } from 'reducers/dataSources';
import { RightAlignedButton, PanelButton } from 'components/Drawer';
import { notification } from 'utils';
import client from '../../../../../client';
import FileBrowser from './FileBrowser';
import {
  BottomPanel,
  Row,
  FileBrowserContainer,
  FormContainer,
} from './styles';
import './styles.css';
import usePath from './../../usePath';

/**
 * @typedef {import('reducers/dataSources/datasource').FileMeta} FileMeta
 *
 * @typedef {import('./FileBrowser').RefContent} RefContent
 *
 * @typedef {import('.').ExtendedDataSource} ExtendedDataSource
 *
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 */

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
const QueryMode = ({ dataSource, form, onDownload }) => {
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();
  const dispatch = useDispatch();
  const [previewFiles, setPreviewFiles] = useState([]);
  const [showQuery, setShowQuery] = useState(false);
  const [isPending, setPending] = useState(false);
  const { goTo } = usePath();
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

  const filteredFiles = useMemo(
    () => (showQuery ? previewFiles : dataSource.files),
    [showQuery, previewFiles, dataSource]
  );

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      form.validateFields(async (err, values) => {
        if (err) return null;
        try {
          setPending(true);
          /** @type {import('axios').AxiosResponse<Snapshot>} */
          const response = await client.post(
            `/datasource/id/${dataSource.id}/snapshot`,
            { snapshot: { query: values.query, name: values.snapshotName } }
          );
          dispatch(snapshotsActions.appendSnapshot(response.data));
          goTo.snapshot({
            nextDataSourceId: dataSource.id,
            nextSnapshotName: response.data.name,
            mode: 'query',
          });
          return null;
        } catch (error) {
          setPending(false);
          return notification({
            message: error?.response?.data?.error?.message ?? error.message,
            type: 'error',
          });
        }
      });
      return null;
    },
    [dispatch, dataSource, form, setPending, goTo]
  );

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ display: 'contents' }}
      initialValues={{ comment: '' }}>
      <FileBrowserContainer>
        <FileBrowser
          isReadOnly
          files={filteredFiles}
          ref={fileBrowserRef}
          onDownload={onDownload}
        />
      </FileBrowserContainer>
      <FormContainer>
        <Row style={{ flex: 1 }}>
          <FormItem
            name={['query']}
            rules={[{ message: 'please enter a query', required: true }]}
            style={{ display: 'contents' }}
            wrapperCol={{ style: { display: 'contents' } }}>
            <Input.TextArea placeholder="Query" allowClear />
          </FormItem>
        </Row>
        <Row>
          <Form.Item
            name={['snapshotName']}
            rules={[
              {
                message: 'please enter a snapshot name',
                max: 25,
                required: true,
              },
            ]}>
            <Input
              prefix={<CameraOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Snapshot Name"
              allowClear
            />
          </Form.Item>
        </Row>
      </FormContainer>
      <BottomPanel>
        <PanelButton type="secondary" onClick={handleTryQuery}>
          Preview Query
        </PanelButton>
        {showQuery || previewFiles.length > 0 ? (
          <PanelButton type="dashed" onClick={handleToggleQuery}>
            {showQuery ? 'Show All' : 'Apply Preview'}
          </PanelButton>
        ) : null}
        <RightAlignedButton
          htmlType="submit"
          type="primary"
          loading={isPending}>
          Create Snapshot
        </RightAlignedButton>
      </BottomPanel>
    </Form>
  );
};

QueryMode.propTypes = {
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSnapshot: PropTypes.bool,
  }).isRequired,
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default QueryMode;
