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
import getBuildTypes from './getBuildTypes.react';

// Direct import for auto-complete
import schema from 'config/schema/algorithm-modal.schema';
import template from 'config/template/algorithm-modal.template';

const insertAlgorithmOptions = options =>
  options.map((option, key) => (
    <Select.Option key={key} value={option}>
      {toUpperCaseFirstLetter(option)}
    </Select.Option>
  ));

const insertRadioButtons = buildTypes =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button key={key} value={key}>
      {toUpperCaseFirstLetter(key)}
    </Radio.Button>
  ));

const AddAlgorithm = ({ form }) => {
  const [buildType, setBuildType] = useState(schema.BUILD_TYPES.CODE.label);
  const [fileList, setFileList] = useState([]);

  const { getFieldDecorator, validateFields } = form;
  const buildTypes = getBuildTypes({ buildType, getFieldDecorator, fileList, setFileList });
  const dispatch = useDispatch();

  const isEmpty = v =>
    v === undefined ||
    v === '' ||
    v === null ||
    (typeof v === 'object' && !Object.entries(v).length);
  const isNotEmpty = v => !isEmpty(v);

  const onSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;
      const formData = new FormData();
      const options = values.options.reduce((acc, option) => ({ ...acc, [option]: true }), {});
      const payload = { ...values, options };
      const [file] = fileList;

      if (buildType === schema.BUILD_TYPES.CODE.label) formData.append('file', file);
      const payloadFiltered = mapObjValues({ obj: payload, predicate: isNotEmpty });

      formData.append('payload', JSON.stringify(payloadFiltered));
      dispatch(applyAlgorithm(formData));
    });
  };

  return (
    <FormNoMargin onSubmit={onSubmit}>
      <FormItem label={schema.NAME.label}>
        {getFieldDecorator(schema.NAME.field, {
          rules: [{ required: true, message: 'Algorithm Name is Required' }]
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
      <FormDivider>{schema.DIVIDER.RESOURCES}</FormDivider>
      <FormItem label={schema.CPU.label}>
        {getFieldDecorator(schema.CPU.field)(<InputNumber min={0.1} />)}
      </FormItem>
      <FormItem label={schema.GPU.label}>
        {getFieldDecorator(schema.GPU.field)(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={schema.MEMORY.label} labelAlign="left">
        {getFieldDecorator(schema.MEMORY.field)(
          <MemoryField>
            {schema.MEMORY.types.map(value => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </MemoryField>
        )}
      </FormItem>
      <FormDivider>{schema.DIVIDER.ADVANCED}</FormDivider>
      <FormItem label={schema.WORKERS.label}>
        {getFieldDecorator(schema.WORKERS.field)(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={schema.OPTIONS.label}>
        {getFieldDecorator(schema.OPTIONS.field, {
          initialValue: Object.entries(template.options)
            .filter(([, isAvailable]) => isAvailable)
            .map(([key]) => key)
        })(
          <Select mode="tags" placeholder="Enable Options">
            {insertAlgorithmOptions(schema.OPTIONS.types)}
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
  form: PropTypes.object.isRequired
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
