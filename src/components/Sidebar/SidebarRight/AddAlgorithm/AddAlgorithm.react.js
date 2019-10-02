import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Input, Select, InputNumber, Form, Button, Radio } from 'antd';

import { DRAWER_SIZE } from 'const';
import { BottomContent } from 'components/common';
import { toUpperCaseFirstLetter, mapObjValues } from 'utils';
import { applyAlgorithm } from 'actions';
import MemoryField from './MemoryField.react';
import { FormItem, FormNoMargin, FormDivider } from './FormElements.react';

// Direct import for auto-complete
import schema from 'config/schema/addAlgorithm.schema';
import template from 'config/template/addAlgorithm.template';
import { CodeBuild, ImageBuild, GitBuild } from './BuildTypes';

const { MAIN, BUILD_TYPES } = schema;

// #region helpers
const insertAlgorithmOptions = options =>
  options.map((option, key) => (
    <Select.Option key={key} value={option}>
      {toUpperCaseFirstLetter(option)}
    </Select.Option>
  ));

const insertRadioButtons = buildTypes =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button key={key} value={key}>
      {key === BUILD_TYPES.GIT.field ? 'Git' : toUpperCaseFirstLetter(key)}
    </Radio.Button>
  ));

const isEmpty = v =>
  v === undefined || v === '' || v === null || (typeof v === 'object' && !Object.entries(v).length);
const isNotEmpty = v => !isEmpty(v);

const mainAdvancedOptions = Object.entries(template.main.options)
  .filter(([, isAvailable]) => isAvailable)
  .map(([key]) => key);

const getBuildTypes = props => {
  const { CODE, IMAGE, GIT } = BUILD_TYPES;
  return {
    [CODE.field]: <CodeBuild {...props} />,
    [IMAGE.field]: <ImageBuild {...props} />,
    [GIT.field]: <GitBuild {...props} />
  };
};

// #endregion

const AddAlgorithm = ({ form, onSubmit }) => {
  const [buildType, setBuildType] = useState(BUILD_TYPES.CODE.field);
  const [fileList, setFileList] = useState([]);

  // Injected from Form.create
  const { getFieldDecorator, validateFields } = form;

  const buildTypes = getBuildTypes({ buildType, getFieldDecorator, fileList, setFileList });

  const dispatch = useDispatch();

  const onFormSubmit = e => {
    e.preventDefault();
    validateFields((err, formObject) => {
      if (err) return;

      const options = formObject.main.options.reduce(
        (acc, option) => ({ ...acc, [option]: true }),
        {}
      );

      const payload =
        buildType === BUILD_TYPES.GIT.field
          ? { ...formObject.main, options, [BUILD_TYPES.GIT.field]: formObject[buildType] }
          : { ...formObject.main, options, ...formObject[buildType] };

      const formData = new FormData();
      if (buildType === BUILD_TYPES.CODE.field) {
        const [file] = fileList;
        formData.append('file', file);
      }

      const payloadFiltered = mapObjValues({ obj: payload, predicate: isNotEmpty });
      formData.append('payload', JSON.stringify(payloadFiltered));

      dispatch(applyAlgorithm(formData));

      onSubmit({ formData, payload: payloadFiltered });
    });
  };

  return (
    <FormNoMargin onSubmit={onFormSubmit}>
      <FormItem label={MAIN.NAME.label}>
        {getFieldDecorator(MAIN.NAME.field, {
          rules: [
            {
              required: true,
              message: 'Algorithm Name must be lower cased.',
              pattern: /^[a-z0-9]+$/
            }
          ]
        })(<Input placeholder="Insert Algorithm Name" />)}
      </FormItem>
      <FormItem label="Build Type">
        <Radio.Group
          defaultValue={buildType}
          buttonStyle="solid"
          onChange={e => setBuildType(e.target.value)}
        >
          {insertRadioButtons(buildTypes)}
        </Radio.Group>
      </FormItem>
      <FormDivider>{MAIN.DIVIDER.RESOURCES}</FormDivider>
      <FormItem label={MAIN.CPU.label}>
        {getFieldDecorator(MAIN.CPU.field)(<InputNumber min={0.1} />)}
      </FormItem>
      <FormItem label={MAIN.GPU.label}>
        {getFieldDecorator(MAIN.GPU.field)(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={MAIN.MEMORY.label} labelAlign="left">
        {getFieldDecorator(MAIN.MEMORY.field)(
          <MemoryField>
            {MAIN.MEMORY.types.map(value => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </MemoryField>
        )}
      </FormItem>
      <FormDivider>{MAIN.DIVIDER.ADVANCED}</FormDivider>
      <FormItem label={MAIN.WORKERS.label}>
        {getFieldDecorator(MAIN.WORKERS.field)(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={MAIN.OPTIONS.label}>
        {getFieldDecorator(MAIN.OPTIONS.field, {
          initialValue: mainAdvancedOptions
        })(
          <Select mode="tags" placeholder="Enable Options">
            {insertAlgorithmOptions(MAIN.OPTIONS.types)}
          </Select>
        )}
      </FormItem>
      <FormDivider>{toUpperCaseFirstLetter(buildType)}</FormDivider>
      {buildTypes[buildType]}
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_ALGORITHM}>
        <Button key="Submit" type="primary" htmlType="submit">
          Submit
        </Button>
      </BottomContent>
    </FormNoMargin>
  );
};

AddAlgorithm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};

const mapPropsToFields = () => {
  const mapper = value => Form.createFormField({ value });
  return mapObjValues({ obj: template, mapper });
};

export default memo(
  Form.create({
    mapPropsToFields
  })(AddAlgorithm)
);
