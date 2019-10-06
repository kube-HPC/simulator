import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '../FormElements.react';
import { Select, Input } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';
import { InputAddon } from 'components/common';
import SelectEnvOptions from '../SelectEnvOptions.react';

const {
  GIT: { URL, BRANCH, COMMIT, ENTRY_POINT, ENVIRONMENT, GIT_KIND, TAG, TOKEN }
} = addAlgorithmSchema.BUILD_TYPES;

const insertGitKindOptions = ({ options, predicate }) =>
  options.map((type, key) => (
    <Select.Option key={key} value={type} disabled={predicate(type)}>
      {toUpperCaseFirstLetter(type)}
    </Select.Option>
  ));

const {
  addOns: { before, after }
} = URL;

const defaultGitHost = 'github';

const GitBuild = ({ required, getFieldDecorator }) => (
  <>
    <FormItem label={URL.label}>
      {getFieldDecorator(URL.field, {
        rules: [{ required, message: URL.message }]
      })(<InputAddon before={before} after={after} placeholder={URL.placeholder} />)}
    </FormItem>
    <FormItem label={BRANCH.label}>
      {getFieldDecorator(BRANCH.field)(<Input placeholder={BRANCH.placeholder} />)}
    </FormItem>
    <FormItem label={TAG.label}>
      {getFieldDecorator(TAG.field)(<Input placeholder={TAG.placeholder} />)}
    </FormItem>
    <FormItem label={TOKEN.label}>
      {getFieldDecorator(TOKEN.field)(<Input.Password placeholder={TOKEN.placeholder} />)}
    </FormItem>
    <FormItem label={GIT_KIND.label}>
      {getFieldDecorator(GIT_KIND.field, {
        initialValue: defaultGitHost
      })(
        // Only supporting github build for now
        <Select placeholder={GIT_KIND.placeholder}>
          {insertGitKindOptions({ options: GIT_KIND.types, predicate: v => v !== defaultGitHost })}
        </Select>
      )}
    </FormItem>
    <FormItem label={COMMIT.ID.label}>
      {getFieldDecorator(COMMIT.ID.field)(<Input placeholder={COMMIT.ID.placeholder} />)}
    </FormItem>
    <FormItem label={ENVIRONMENT.label}>
      {getFieldDecorator(ENVIRONMENT.field, {
        rules: [{ required, message: ENVIRONMENT.message }]
      })(<SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />)}
    </FormItem>
    <FormItem label={ENTRY_POINT.label}>
      {getFieldDecorator(ENTRY_POINT.field, {
        rules: [{ required, message: ENTRY_POINT.message }]
      })(<Input placeholder={ENTRY_POINT.placeholder} />)}
    </FormItem>
  </>
);

GitBuild.propTypes = {
  required: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired
};

export default GitBuild;
