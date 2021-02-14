import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Input, Icon, Form, Button, Alert, Radio } from 'antd';
import styled from 'styled-components';
import { BottomContent, Form as CommonForm } from 'components/common';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import pruneObject from 'utils/pruneObject';
import { DRAWER_SIZE } from 'const';
import { selectors } from 'reducers';
import { useActions } from 'hooks';
import ctx from './../ctx';

/** @type {import('antd/lib/upload/interface').UploadFile[]} */
const initialFilesList = [];

const FormItem = styled(Form.Item)`
  margin-bottom: 0;
`;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddDataSource = ({ form }) => {
  const context = useContext(ctx);
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  const gitKind = getFieldValue('kind');
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
        const { kind } = formObject;
        const payload = {
          name: formObject.name,
          storage: {
            accessKeyId: formObject.storageAccessKeyId,
            secretAccessKey: formObject.storageAccessKey,
            endpoint: formObject.storageEndpoint,
            bucketName: formObject.storageBucketName,
            useSSL: formObject.useSSL === 'true',
          },
          git: {
            organization: formObject.gitOrganization || null,
            endpoint: formObject.gitEndpoint,
            token: formObject.gitToken,
            kind,
            tokenName: kind === 'gitlab' ? formObject.gitTokenTokenName : null,
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
    <Form {...formItemLayout} onSubmit={onSubmit} layout="horizontal">
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
        {getFieldDecorator('kind', { initialValue: 'gitlab' })(
          <Radio.Group>
            <Radio.Button value="github">
              <Icon type="github" /> Github
            </Radio.Button>
            <Radio.Button value="gitlab">
              <Icon type="gitlab" /> Gitlab
            </Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem label="Provider Endpoint">
        {getFieldDecorator('gitEndpoint', {
          rules: [
            { required: true, message: 'Please provide a git host endpoint' },
          ],
        })(
          <Input
            prefix={<Icon type="apartment" />}
            placeholder="Git endpoint"
            required
          />
        )}
      </FormItem>
      <FormItem label="Organization">
        {getFieldDecorator('gitOrganization')(
          <Input
            prefix={<Icon type="team" />}
            placeholder="Organization Name (optional)"
          />
        )}
      </FormItem>
      <FormItem label="Access Token">
        {getFieldDecorator('gitToken', {
          rules: [
            { required: true, message: 'Please provide a git user token' },
          ],
        })(
          <Input
            prefix={<Icon type="key" />}
            placeholder="Access Token"
            required
          />
        )}
      </FormItem>
      {gitKind === 'gitlab' && (
        <FormItem label="Access Token Name">
          {getFieldDecorator('gitTokenTokenName', {
            rules: [
              {
                required: true,
                message: 'Please provide a gitlab token name',
              },
            ],
          })(<Input placeholder="Access Token Name" required />)}
        </FormItem>
      )}
      {/* -------------------------- storage -------------------------- */}
      <CommonForm.Divider>Storage</CommonForm.Divider>
      <FormItem label="Endpoint">
        {getFieldDecorator('storageEndpoint', {
          rules: [
            { required: true, message: 'Please provide an S3 host endpoint' },
          ],
        })(
          <Input
            prefix={<Icon type="apartment" />}
            placeholder="Storage Endpoint"
            required
          />
        )}
      </FormItem>
      <FormItem label="Bucket Name">
        {getFieldDecorator('storageBucketName', {
          rules: [
            { required: true, message: 'Please provide an S3 bucket name' },
          ],
        })(
          <Input
            prefix={<Icon type="folder" />}
            placeholder="Bucket Name"
            required
          />
        )}
      </FormItem>
      <FormItem label="Bucket Name">
        {getFieldDecorator('storageUseSSL', { initialValue: 'false' })(
          <Radio.Group>
            <Radio.Button value="false">no-ssl</Radio.Button>
            <Radio.Button value="true">use-ssl</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem label="Access Key">
        {getFieldDecorator('storageAccessKey', {
          rules: [
            { required: true, message: 'Please provide an S3 Access Key' },
          ],
        })(
          <Input
            prefix={<Icon type="key" />}
            placeholder="Access Key"
            required
          />
        )}
      </FormItem>
      {/* retain the original Form.item bottom-margin */}
      <Form.Item label="Access Key ID">
        {getFieldDecorator('storageAccessKeyId', {
          rules: [
            { required: true, message: 'Please provide an S3 Access Key ID' },
          ],
        })(
          <Input
            // prefix={<Icon type="database" />}
            placeholder="Access Key ID"
            required
          />
        )}
      </Form.Item>
      <Form.Item wrapperCol={null}>
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
