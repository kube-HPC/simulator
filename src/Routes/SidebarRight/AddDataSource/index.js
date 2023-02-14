import React, { useCallback, useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import {
  DatabaseOutlined,
  GithubOutlined,
  GitlabOutlined,
} from '@ant-design/icons';

import { Form, Input, Button, Alert, Radio } from 'antd';
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

const AddDataSource = () => {
  const [form] = Form.useForm();
  const context = useContext(ctx);
  const { validateFields } = form;

  const [gitKind, setGitKind] = useState('internal');
  const onBuildTypeGitChange = e => setGitKind(e.target.value);

  const [storageKind, setStorageKind] = useState('internal');
  const onBuildTypeStorageChange = e => setStorageKind(e.target.value);

  const actions = useActions();

  const [addedFiles, setAddedFiles] = useState(initialFilesList);
  const { onChange, customRequest } = useDragger({
    setFileList: setAddedFiles,
  });
  const SubmittingStatus = useSelector(selectors.dataSources.createStatus);

  const onSubmit = useCallback(() => {
    validateFields().then(formObject => {
      const { gitKind: _gitKind, storageKind: _storageKind } = formObject;
      const payload = {
        name: formObject.name,
        storage: {
          kind: formObject.storageKind,
          ...(_storageKind === 'internal'
            ? {}
            : {
                accessKeyId: formObject.storageAccessKeyId,
                secretAccessKey: formObject.storageSecretAccessKey,
                endpoint: formObject.storageEndpoint,
                bucketName: formObject.storageBucketName,
              }),
        },
        git: {
          kind: _gitKind,
          ...(_gitKind === 'internal'
            ? {}
            : {
                repositoryUrl: formObject.repositoryUrl,
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
  }, [actions, validateFields, addedFiles, context]);

  return (
    <Form
      labelAlign="left"
      name="create-dataSource"
      form={form}
      initialValues={{ gitKind: 'internal', storageKind: 'internal' }}
      {...formItemLayout}
      onFinish={onSubmit}
      layout="horizontal"
      style={{ overflow: 'auto', maxHeight: '90vh' }}>
      <FormItem
        name="name"
        label="DataSource Name"
        rules={[
          {
            required: true,
            message: 'Please insert a name for the new DataSource',
          },
        ]}>
        <Input prefix={<DatabaseOutlined />} placeholder="name" required />
      </FormItem>

      {/* -------------------------- git -------------------------- */}
      <CommonForm.Divider>Git</CommonForm.Divider>
      <FormItem label="Provider" name="gitKind" defaultValue="internal">
        <Radio.Group onChange={onBuildTypeGitChange}>
          <Radio.Button value="github">
            <GithubOutlined /> Github
          </Radio.Button>
          <Radio.Button value="gitlab">
            <GitlabOutlined /> Gitlab
          </Radio.Button>
          <Radio.Button value="internal">Internal</Radio.Button>
        </Radio.Group>
      </FormItem>
      {gitKind === 'internal' ? null : <GitConfig kind={gitKind} />}
      {/* -------------------------- storage -------------------------- */}
      <CommonForm.Divider>Storage</CommonForm.Divider>
      <FormItem label="Provider" name="storageKind">
        <Radio.Group onChange={onBuildTypeStorageChange}>
          <Radio.Button value="S3">S3</Radio.Button>
          <Radio.Button value="internal">Internal</Radio.Button>
        </Radio.Group>
      </FormItem>
      {storageKind === 'internal' ? null : <StorageConfig />}
      <Form.Item wrapperCol={17} style={{ marginTop: '1em' }}>
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

export default AddDataSource;
