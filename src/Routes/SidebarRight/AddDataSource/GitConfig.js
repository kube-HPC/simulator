import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import { FormItem } from './styles';

const GitConfig = ({ kind, getFieldDecorator }) => (
  <>
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
        rules: [{ required: true, message: 'Please provide a git user token' }],
      })(
        <Input
          prefix={<Icon type="key" />}
          placeholder="Access Token"
          required
        />
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
