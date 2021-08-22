import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { Form, InputAddon } from 'components/common';
import { toUpperCaseFirstLetter, splitByDot } from 'utils';
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

const GitBuild = ({ required }) => (
  <>
    <Form.Divider>{DIVIDERS.BUILD}</Form.Divider>
    <Form.Item
      name={splitByDot(ENVIRONMENT.field)}
      label={ENVIRONMENT.label}
      rules={[{ required, message: ENVIRONMENT.message }]}>
      <SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />
    </Form.Item>
    <Form.Item
      label={ENTRY_POINT.label}
      name={splitByDot(ENTRY_POINT.field)}
      rules={[{ required, message: ENTRY_POINT.message }]}>
      <Input placeholder={ENTRY_POINT.placeholder} />
    </Form.Item>
    <Form.Item label={BASE_IMAGE.label} name={splitByDot(BASE_IMAGE.field)}>
      <Input placeholder={BASE_IMAGE.placeholder} />
    </Form.Item>
    <Form.Divider>{DIVIDERS.GIT}</Form.Divider>
    <Form.Item
      name={splitByDot(GIT_KIND.field)}
      label={GIT_KIND.label}
      initialValue={defaultGitHost}>
      <Radio.Group>
        {insertGitKindOptions({ options: GIT_KIND.types })}
      </Radio.Group>
    </Form.Item>
    )
    <Form.Item
      name={splitByDot(URL.field)}
      label={URL.label}
      rules={[{ required, message: URL.message }]}>
      <InputAddon before={before} after={after} placeholder={URL.placeholder} />
    </Form.Item>
    <Form.Item label={BRANCH.label} name={splitByDot(BRANCH.field)}>
      <Input placeholder={BRANCH.placeholder} />
    </Form.Item>
    <Form.Item label={TAG.label} name={splitByDot(TAG.field)}>
      <Input placeholder={TAG.placeholder} />
    </Form.Item>
    <Form.Item label={TOKEN.label} name={splitByDot(TOKEN.field)}>
      <Input.Password placeholder={TOKEN.placeholder} />
    </Form.Item>
    <Form.Item label={COMMIT.ID.label} name={splitByDot(COMMIT.ID.field)}>
      <Input placeholder={COMMIT.ID.placeholder} />
    </Form.Item>
  </>
);

GitBuild.propTypes = {
  required: PropTypes.bool.isRequired,
};

export default GitBuild;
