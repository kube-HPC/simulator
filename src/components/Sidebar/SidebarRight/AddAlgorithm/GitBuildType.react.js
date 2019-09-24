import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { algorithmModalSchema as schema } from 'config';

const { REPOSITORY, BRANCH, TOKEN, TAG, GIT_KIND } = schema.BUILD_TYPES.GIT;

const GitBuildType = React.forwardRef(({ onChange, FormItem }) => {
  return (
    <>
      <FormItem label={REPOSITORY.label}>
        <Input placeholder={REPOSITORY.placeholder} />
      </FormItem>
      <FormItem label={BRANCH.label}>
        <Input placeholder={BRANCH.placeholder} />
      </FormItem>
      <FormItem label={TAG.label}>
        <Input placeholder={TAG.placeholder} />
      </FormItem>
      <FormItem label={TOKEN.label}>
        <Input.Password placeholder={TOKEN.placeholder} />
      </FormItem>
      <FormItem label={GIT_KIND.label}>
        <Input placeholder={GIT_KIND.placeholder} />
      </FormItem>
    </>
  );
});

GitBuildType.propTypes = {
  FormItem: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GitBuildType;
