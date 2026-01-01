import React from 'react';
import PropTypes from 'prop-types';
import { ApartmentOutlined, KeyOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { FormItem } from './styles';

const GitConfig = ({ kind }) => (
  <>
    <FormItem
      label="Repository url"
      name="repositoryUrl"
      rules={[{ required: true, message: 'Please provide a repository url' }]}>
      <Input
        prefix={<ApartmentOutlined />}
        placeholder="Repository url"
        required
      />
    </FormItem>
    <FormItem
      label="Access Token"
      name="gitToken"
      rules={[{ required: true, message: 'Please provide a git user token' }]}>
      <Input prefix={<KeyOutlined />} placeholder="Access Token" required />
    </FormItem>
    {kind === 'gitlab' && (
      <FormItem
        label="Access Token Name"
        name="gitTokenTokenName"
        rules={[
          {
            required: true,
            message: 'Please provide a gitlab token name',
          },
        ]}>
        <Input placeholder="Access Token Name" required />
      </FormItem>
    )}
  </>
);

GitConfig.propTypes = {
  kind: PropTypes.oneOf(['github', 'gitlab']).isRequired,
};

export default GitConfig;
