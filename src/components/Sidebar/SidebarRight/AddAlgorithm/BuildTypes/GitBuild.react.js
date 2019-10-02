import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '../FormElements.react';
import { Select, Input } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';
import { InputAddon } from 'components/common';

const { GIT } = addAlgorithmSchema.BUILD_TYPES;

const insertGitKindOptions = ({ options, predicate }) =>
  options.map((type, key) => (
    <Select.Option key={key} value={type} disabled={predicate(type)}>
      {toUpperCaseFirstLetter(type)}
    </Select.Option>
  ));

const beforeSelect = ['https://', 'http://'];

const GitBuild = ({ buildType, getFieldDecorator }) => (
  <>
    <FormItem label={GIT.URL.label}>
      {getFieldDecorator(GIT.URL.field, {
        rules: [
          {
            required: buildType === GIT.field,
            message: 'GIT URL required'
          }
        ]
      })(<InputAddon before={beforeSelect} after=".git" placeholder={GIT.URL.placeholder} />)}
    </FormItem>
    <FormItem label={GIT.BRANCH.label}>
      {getFieldDecorator(GIT.BRANCH.field)(<Input placeholder={GIT.BRANCH.placeholder} />)}
    </FormItem>
    <FormItem label={GIT.TAG.label}>
      {getFieldDecorator(GIT.TAG.field)(<Input placeholder={GIT.TAG.placeholder} />)}
    </FormItem>
    <FormItem label={GIT.TOKEN.label}>
      {getFieldDecorator(GIT.TOKEN.field)(<Input.Password placeholder={GIT.TOKEN.placeholder} />)}
    </FormItem>
    <FormItem label={GIT.GIT_KIND.label}>
      {getFieldDecorator(GIT.GIT_KIND.field)(
        <Select placeholder={GIT.GIT_KIND.placeholder}>
          {insertGitKindOptions({
            options: GIT.GIT_KIND.types,
            // Currently not supported
            predicate: v => v === 'gitlab'
          })}
        </Select>
      )}
    </FormItem>
    <FormItem label={GIT.COMMIT.ID.label}>
      {getFieldDecorator(GIT.COMMIT.ID.field)(<Input placeholder={GIT.COMMIT.ID.placeholder} />)}
    </FormItem>
  </>
);

GitBuild.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  buildType: PropTypes.string.isRequired
};

export default GitBuild;
