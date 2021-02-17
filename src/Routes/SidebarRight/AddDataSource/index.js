import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Input, Icon, Form, Button, Alert, Radio } from 'antd';
import { BottomContent, Form as CommonForm } from 'components/common';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import pruneObject from 'utils/pruneObject';
import { DRAWER_SIZE } from 'const';
import { selectors } from 'reducers';
import { useActions } from 'hooks';
import ctx from './../ctx';
import { FormItem } from './styles';
import GitConfig from './GitConfig';
import StorageConfig from './StorageConfig';

/** @type {import('antd/lib/upload/interface').UploadFile[]} */
const initialFilesList = [];

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddDataSource = ({ form }) => {
  const context = useContext(ctx);
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  const gitKind = getFieldValue('gitKind');
  const storageKind = getFieldValue('storageKind');
  const actions = useActions();

  const [addedFiles, setAddedFiles] = useState(initialFilesList);
  const { onChange, customRequest } = useDragger({
    setFileList: setAddedFiles,
  });
  const SubmittingStatus = useSelector(selectors.dataSources.createStatus);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      validateFields((err, formObject) => {
        if (err) return;
        const { gitKind: _gitKind, storageKind: _storageKind } = formObject;
        const payload = {
          name: formObject.name,
          storage: {
            kind: formObject.storageKind,
            ...(_storageKind === 'internal'
              ? {}
              : {
                  accessKeyId: formObject.storageAccessKeyId,
                  secretAccessKey: formObject.storageAccessKey,
                  endpoint: formObject.storageEndpoint,
                  bucketName: formObject.storageBucketName,
                }),
          },
          git: {
            kind: _gitKind,
            ...(_gitKind === 'internal'
              ? {}
              : {
                  organization: formObject.gitOrganization || null,
                  endpoint: formObject.gitEndpoint,
                  token: formObject.gitToken,
                  tokenName:
                    _gitKind === 'gitlab' ? formObject.gitTokenTokenName : null,
                }),
          },
        };

        const prunedPayload = pruneObject(payload);
        actions.createDataSource(
          { files: addedFiles, ...prunedPayload },
          { onSuccess: context.closeDrawer }
        );
      });
    },
    [actions, validateFields, addedFiles, context]
  );

  return (
    <Form
      {...formItemLayout}
      onSubmit={onSubmit}
      layout="horizontal"
      style={{ overflow: 'auto', maxHeight: '90vh' }}>
      <FormItem label="DataSource Name">
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: 'Please insert a name for the new DataSource',
            },
          ],
        })(
          <Input
            prefix={<Icon type="database" />}
            placeholder="name"
            required
          />
        )}
      </FormItem>
      {/* -------------------------- git -------------------------- */}
      <CommonForm.Divider>Git</CommonForm.Divider>
      <FormItem label="Provider">
        {getFieldDecorator('gitKind', { initialValue: 'internal' })(
          <Radio.Group>
            <Radio.Button value="github">
              <Icon type="github" /> Github
            </Radio.Button>
            <Radio.Button value="gitlab">
              <Icon type="gitlab" /> Gitlab
            </Radio.Button>
            <Radio.Button value="internal">
              <Icon type="internal" /> Internal
            </Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      {gitKind === 'internal' ? null : (
        <GitConfig kind={gitKind} getFieldDecorator={getFieldDecorator} />
      )}
      {/* -------------------------- storage -------------------------- */}
      <CommonForm.Divider>Storage</CommonForm.Divider>
      <FormItem label="Provider">
        {getFieldDecorator('storageKind', { initialValue: 'internal' })(
          <Radio.Group>
            <Radio.Button value="S3">
              <Icon type="S3" /> S3
            </Radio.Button>
            <Radio.Button value="internal">
              <Icon type="internal" /> Internal
            </Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      {storageKind === 'internal' ? null : (
        <StorageConfig getFieldDecorator={getFieldDecorator} />
      )}
      <Form.Item wrapperCol={null} style={{ marginTop: '1em' }}>
        <UploadDragger
          onChange={onChange}
          fileList={addedFiles}
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
      </Form.Item>
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DATASOURCE}>
        <Button
          key="Submit"
          type="primary"
          onClick={onSubmit}
          loading={SubmittingStatus === 'PENDING'}>
          Create
        </Button>
      </BottomContent>
    </Form>
  );
};
AddDataSource.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
export default Form.create({ name: 'create-dataSource' })(AddDataSource);
