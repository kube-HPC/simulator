import React from 'react';
import PropTypes from 'prop-types';
import { ApartmentOutlined, KeyOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { FormItem } from './styles';

const GitConfig = ({ kind, getFieldDecorator }) => (
  <>
    <FormItem label="Repository url">
      {getFieldDecorator('repositoryUrl', {
        rules: [{ required: true, message: 'Please provide a repository url' }],
      })(
        <Input
          prefix={<ApartmentOutlined />}
          placeholder="Repository url"
          required
        />
      )}
    </FormItem>
    <FormItem label="Access Token">
      {getFieldDecorator('gitToken', {
        rules: [{ required: true, message: 'Please provide a git user token' }],
      })(
        <Input prefix={<KeyOutlined />} placeholder="Access Token" required />
      )}
    </FormItem>
    {kind === 'gitlab' && (
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
  </>
);

GitConfig.propTypes = {
  kind: PropTypes.oneOf(['github', 'gitlab']).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
};

export default GitConfig;
