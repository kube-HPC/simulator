import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { Form, InputAddon } from 'components/common';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from '../schema';
import SelectEnvOptions from '../SelectEnvOptions.react';

const {
  GIT: {
    URL,
    BRANCH,
    COMMIT,
    ENTRY_POINT,
    ENVIRONMENT,
    GIT_KIND,
    TAG,
    TOKEN,
    BASE_IMAGE,
    DIVIDERS,
  },
} = addAlgorithmSchema.BUILD_TYPES;

const insertGitKindOptions = ({ options, predicate = () => {} }) =>
  options.map(type => (
    <Radio key={type} value={type} disabled={predicate(type)}>
      {toUpperCaseFirstLetter(type)}
    </Radio>
  ));

const {
  addOns: { before, after },
} = URL;

const defaultGitHost = 'github';

const GitBuild = ({ required, getFieldDecorator }) => (
  <>
    <Form.Divider>{DIVIDERS.BUILD}</Form.Divider>
    <Form.Item label={ENVIRONMENT.label}>
      {getFieldDecorator(ENVIRONMENT.field, {
        rules: [{ required, message: ENVIRONMENT.message }],
      })(<SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />)}
    </Form.Item>
    <Form.Item label={ENTRY_POINT.label}>
      {getFieldDecorator(ENTRY_POINT.field, {
        rules: [{ required, message: ENTRY_POINT.message }],
      })(<Input placeholder={ENTRY_POINT.placeholder} />)}
    </Form.Item>
    <Form.Item label={BASE_IMAGE.label}>
      {getFieldDecorator(BASE_IMAGE.field)(
        <Input placeholder={BASE_IMAGE.placeholder} />
      )}
    </Form.Item>
    <Form.Divider>{DIVIDERS.GIT}</Form.Divider>
    <Form.Item label={GIT_KIND.label}>
      {getFieldDecorator(GIT_KIND.field, {
        initialValue: defaultGitHost,
      })(
        <Radio.Group>
          {insertGitKindOptions({ options: GIT_KIND.types })}
        </Radio.Group>
      )}
    </Form.Item>
    <Form.Item label={URL.label}>
      {getFieldDecorator(URL.field, {
        rules: [{ required, message: URL.message }],
      })(
        <InputAddon
          before={before}
          after={after}
          placeholder={URL.placeholder}
        />
      )}
    </Form.Item>
    <Form.Item label={BRANCH.label}>
      {getFieldDecorator(BRANCH.field)(
        <Input placeholder={BRANCH.placeholder} />
      )}
    </Form.Item>
    <Form.Item label={TAG.label}>
      {getFieldDecorator(TAG.field)(<Input placeholder={TAG.placeholder} />)}
    </Form.Item>
    <Form.Item label={TOKEN.label}>
      {getFieldDecorator(TOKEN.field)(
        <Input.Password placeholder={TOKEN.placeholder} />
      )}
    </Form.Item>
    <Form.Item label={COMMIT.ID.label}>
      {getFieldDecorator(COMMIT.ID.field)(
        <Input placeholder={COMMIT.ID.placeholder} />
      )}
    </Form.Item>
  </>
);

GitBuild.propTypes = {
  required: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
};

export default GitBuild;
