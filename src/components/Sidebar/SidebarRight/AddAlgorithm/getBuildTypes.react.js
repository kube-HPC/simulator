import React from 'react';
import { FormItem } from './FormElements.react';
import { Input, Upload, Icon, Select } from 'antd';

import schema from 'config/schema/algorithm-modal.schema';

import { toUpperCaseFirstLetter } from 'utils';
import InputValidate from './InputValidate.react';

const { CODE, IMAGE, GIT } = schema.BUILD_TYPES;

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Select.Option key={key} value={key}>
      {toUpperCaseFirstLetter(value)}
    </Select.Option>
  ));

const insertGitKindOptions = options =>
  options.map((type, key) => (
    <Select.Option key={key} value={type}>
      {toUpperCaseFirstLetter(type)}
    </Select.Option>
  ));

const draggerMarginTop = { marginTop: 15 };
const beforeSelect = ['https://', 'http://'];

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
            <Select placeholder={CODE.ENVIRONMENT.placeholder}>
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
        <FormItem wrapperCol={null} style={draggerMarginTop}>
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
      // https://regex101.com/r/bQAO0J/1
      <>
        <FormItem label={GIT.URL.label}>
          {getFieldDecorator(GIT.URL.field, {
            rules: [
              {
                required: buildType === GIT.label,
                message: 'GIT URL required'
              }
            ]
          })(
            <InputValidate before={beforeSelect} after=".git" placeholder={GIT.URL.placeholder} />
          )}
        </FormItem>
        <FormItem label={GIT.BRANCH.label}>
          {getFieldDecorator(GIT.BRANCH.field)(<Input placeholder={GIT.BRANCH.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.TAG.label}>
          {getFieldDecorator(GIT.TAG.field)(<Input placeholder={GIT.TAG.placeholder} />)}
        </FormItem>
        <FormItem label={GIT.TOKEN.label}>
          {getFieldDecorator(GIT.TOKEN.field)(
            <Input.Password placeholder={GIT.TOKEN.placeholder} />
          )}
        </FormItem>
        <FormItem label={GIT.GIT_KIND.label}>
          {getFieldDecorator(GIT.GIT_KIND.field)(
            <Select placeholder={GIT.GIT_KIND.placeholder}>
              {insertGitKindOptions(GIT.GIT_KIND.types)}
            </Select>
          )}
        </FormItem>
        <FormItem label={GIT.COMMIT.ID.label}>
          {getFieldDecorator(GIT.COMMIT.ID.field)(
            <Input placeholder={GIT.COMMIT.ID.placeholder} />
          )}
        </FormItem>
      </>
    )
  };
};

export default getBuildTypes;
