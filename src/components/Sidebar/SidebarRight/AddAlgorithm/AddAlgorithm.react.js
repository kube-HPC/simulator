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
const toReadableBuildType = buildType =>
  toUpperCaseFirstLetter(buildType === BUILD_TYPES.GIT.field ? 'GIT' : buildType);

const insertAlgorithmOptions = options =>
  options.map((option, key) => (
    <Select.Option key={key} value={option}>
      {toUpperCaseFirstLetter(option)}
    </Select.Option>
  ));

const insertRadioButtons = buildTypes =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button key={key} value={key}>
      {toReadableBuildType(key)}
    </Radio.Button>
  ));

const isEmpty = v =>
  v === undefined || v === '' || v === null || (typeof v === 'object' && !Object.entries(v).length);
const isNotEmpty = v => !isEmpty(v);

const mainAdvancedOptions = Object.entries(template.main.options)
  .filter(([, isAvailable]) => isAvailable)
  .map(([key]) => key);

const getBuildTypes = ({ buildType, ...props }) => {
  const { CODE, IMAGE, GIT } = BUILD_TYPES;
  const isRequired = type => type === buildType;
  return {
    [CODE.field]: <CodeBuild required={isRequired(CODE.field)} {...props} />,
    [IMAGE.field]: <ImageBuild required={isRequired(IMAGE.field)} {...props} />,
    [GIT.field]: <GitBuild required={isRequired(GIT.field)} {...props} />
  };
};

const lowCaseNumberRegex = /^[a-z0-9]+$/;

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
      if (err || !fileList.length) return;

      // Reduce selected options to boolean entry
      const options = formObject.main.options.reduce(
        (acc, option) => ({ ...acc, [option]: true }),
        {}
      );

      // On GIT build type, env & entryPoint are on the top object's keys level
      const { env, entryPoint, ...rest } = formObject[buildType];

      const payload =
        buildType === BUILD_TYPES.GIT.field
          ? { ...formObject.main, options, [BUILD_TYPES.GIT.field]: rest, env, entryPoint }
          : { ...formObject.main, options, ...formObject[buildType] };

      const formData = new FormData();
      if (buildType === BUILD_TYPES.CODE.field) formData.append('file', fileList);

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
              message: MAIN.NAME.message,
              pattern: lowCaseNumberRegex
            }
          ]
        })(<Input placeholder={MAIN.NAME.placeholder} />)}
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
          <Select mode="tags" placeholder={MAIN.OPTIONS.placeholder}>
            {insertAlgorithmOptions(MAIN.OPTIONS.types)}
          </Select>
        )}
      </FormItem>
      <FormDivider>{toReadableBuildType(buildType)}</FormDivider>
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

AddAlgorithm.defaultProps = {
  onSubmit: () => {}
};

const mapper = value => Form.createFormField({ value });
const mapPropsToFields = () => mapObjValues({ obj: template, mapper });

export default memo(
  Form.create({
    mapPropsToFields
  })(AddAlgorithm)
);
