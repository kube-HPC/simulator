import React from 'react';
import PropTypes from 'prop-types';
import {
  ApartmentOutlined,
  FolderOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';
import { FormItem } from './styles';

const StorageConfig = ({ getFieldDecorator }) => (
  <>
    <FormItem label="Endpoint">
      {getFieldDecorator('storageEndpoint', {
        rules: [
          { required: true, message: 'Please provide an S3 host endpoint' },
        ],
      })(
        <Input
          prefix={<ApartmentOutlined />}
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
        <Input prefix={<FolderOutlined />} placeholder="Bucket Name" required />
      )}
    </FormItem>
    <FormItem label="Access key ID">
      {getFieldDecorator('storageAccessKeyId', {
        rules: [
          { required: true, message: 'Please provide an S3 Access key ID' },
        ],
      })(<Input placeholder="Access key ID" required />)}
    </FormItem>
    <FormItem label="Secret access key">
      {getFieldDecorator('storageSecretAccessKey', {
        rules: [
          { required: true, message: 'Please provide an S3 Secret access key' },
        ],
      })(
        <Input
          prefix={<KeyOutlined />}
          placeholder="Secret access key"
          required
        />
      )}
    </FormItem>
  </>
);

StorageConfig.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default StorageConfig;
