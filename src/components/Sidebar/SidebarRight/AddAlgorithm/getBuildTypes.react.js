import React from 'react';
import { FormItem, FormDivider } from './FormElements.react';
import { Input, Upload, Icon, Select } from 'antd';

import { algorithmModalTemplate as template, algorithmModalSchema as schema } from 'config';

const mutateFields = ({ target, obj }) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value.field ? { ...value, field: `${target}.${value.field}` } : value
    ])
  );

const { CODE, IMAGE, GIT: GIT_SOURCE } = schema.BUILD_TYPES;
const gitMutatedShallowFields = mutateFields({ target: GIT_SOURCE.field, obj: GIT_SOURCE });
const COMMIT = mutateFields({
  target: gitMutatedShallowFields.COMMIT.field,
  obj: gitMutatedShallowFields.COMMIT
});

const GIT = { ...gitMutatedShallowFields, COMMIT };

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Select.Option key={key} value={key}>
      {value}
    </Select.Option>
  ));

const getBuildTypes = ({ buildType, getFieldDecorator, fileList, setFileList }) => {
  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.zip,.tar.gz',
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        setFileList([file]);
        onSuccess('OK');
      }, 0);
    },
    fileList,
    onRemove: () => setFileList([])
  };

  return {
    [CODE.label]: (
      <>
        <FormItem label={CODE.ENVIRONMENT.label}>
          {getFieldDecorator(CODE.ENVIRONMENT.field, {
            rules: [{ required: buildType === CODE.label, message: 'Environment required' }]
          })(
            <Select placeholder="Pick Environment">
              {insertEnvOptions(CODE.ENVIRONMENT.types)}
            </Select>
          )}
        </FormItem>
        <FormItem label={CODE.ENTRY_POINT.label}>
          {getFieldDecorator(CODE.ENTRY_POINT.field)(<Input placeholder="Insert Entry Point" />)}
        </FormItem>
        <FormItem label={CODE.VERSION.label}>
          {getFieldDecorator(CODE.VERSION.field)(<Input placeholder="Insert Version" />)}
        </FormItem>
        <FormItem wrapperCol={null} style={{ marginTop: '15px' }}>
          <Upload.Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag algorithm source code to this area to upload
            </p>
            <p className="ant-upload-hint">Support for zip or tar.gz only</p>
          </Upload.Dragger>
        </FormItem>
      </>
    ),
    [IMAGE.label]: (
      <FormItem label={IMAGE.ALGORITHM_IMAGE.label}>
        {getFieldDecorator(IMAGE.ALGORITHM_IMAGE.field, {
          rules: [{ required: buildType === IMAGE.label, message: 'Image URL required' }]
        })(<Input placeholder="Insert URL" />)}
      </FormItem>
    ),
    [GIT.label]: (
      <>
        <FormItem label={GIT.URL.label}>
          {getFieldDecorator(GIT.URL.field, {
            initialValue: template.gitRepository.url,
            rules: [{ required: buildType === GIT.label, message: 'GIT URL required' }]
          })(<Input placeholder={GIT.URL.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.BRANCH.label}>
          {getFieldDecorator(GIT.BRANCH.field, {
            initialValue: template.gitRepository.branchName
          })(<Input placeholder={GIT.BRANCH.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.TAG.label}>
          {getFieldDecorator(GIT.TAG.field, {
            initialValue: template.gitRepository.tag
          })(<Input placeholder={GIT.TAG.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.TOKEN.label}>
          {getFieldDecorator(GIT.TOKEN.field, {
            initialValue: template.gitRepository.token
          })(<Input.Password placeholder={GIT.TOKEN.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.GIT_KIND.label}>
          {getFieldDecorator(GIT.GIT_KIND.field, {
            initialValue: template.gitRepository.gitKind
          })(<Input placeholder={GIT.GIT_KIND.placeholder} />)}
        </FormItem>
        <FormDivider>{GIT.COMMIT.label}</FormDivider>
        <FormItem label={GIT.COMMIT.ID.label}>
          {getFieldDecorator(GIT.COMMIT.ID.field, {
            initialValue: template.gitRepository.commit.id,
            rules: [{ required: buildType === GIT.label, message: 'GIT ID required' }]
          })(<Input placeholder={GIT.COMMIT.ID.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.COMMIT.TIMESTAMP.label}>
          {getFieldDecorator(GIT.COMMIT.TIMESTAMP.field, {
            initialValue: template.gitRepository.commit.timestamp
          })(<Input placeholder={GIT.COMMIT.TIMESTAMP.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.COMMIT.MESSAGE.label}>
          {getFieldDecorator(GIT.COMMIT.MESSAGE.field, {
            initialValue: template.gitRepository.commit.message
          })(<Input placeholder={GIT.COMMIT.MESSAGE.placeholder} />)}
        </FormItem>
      </>
    )
  };
};

export default getBuildTypes;
