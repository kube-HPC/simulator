import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
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
    <FormItem label="Access Key">
      {getFieldDecorator('storageAccessKey', {
        rules: [{ required: true, message: 'Please provide an S3 Access Key' }],
      })(
        <Input prefix={<Icon type="key" />} placeholder="Access Key" required />
      )}
    </FormItem>
    {/* retain the original Form.item bottom-margin */}
    <FormItem label="Access Key ID">
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
    </FormItem>
  </>
);

StorageConfig.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default StorageConfig;
