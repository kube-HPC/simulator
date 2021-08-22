import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, InputNumber, Radio, Select } from 'antd';
import { Form } from 'components/common';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
} from 'components/Drawer';
import formTemplate from 'config/template/addAlgorithmForm.template';
import { useActions } from 'hooks';
import {
  mapObjValues,
  notification,
  stringify,
  toUpperCaseFirstLetter,
  splitByDot,
} from 'utils';
import { CodeBuild, GitBuild, ImageBuild } from './BuildTypes';
import MemoryField from './MemoryField.react';
import schema from './schema';

// #region  Helpers
const { MAIN, BUILD_TYPES } = schema;

// https://github.com/kube-HPC/hkube/blob/master/core/api-server/lib/consts/regex.js
const ALGO_REGEX = /^[a-z0-9][-a-z0-9\\.]*[a-z0-9]$/;

const mainAdvancedOptions = Object.entries(formTemplate.main.options)
  .filter(([, isAvailable]) => isAvailable)
  .map(([key]) => key);

const insertAlgorithmOptions = options =>
  options.map((option, key) => (
    // eslint-disable-next-line
    <Select.Option key={key} value={option}>
      {toUpperCaseFirstLetter(option)}
    </Select.Option>
  ));

const toReadableBuildType = buildType =>
  toUpperCaseFirstLetter(
    buildType === BUILD_TYPES.GIT.field ? `GIT` : buildType
  );

const insertRadioButtons = buildTypes =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button key={key} value={key}>
      {toReadableBuildType(key)}
    </Radio.Button>
  ));

const isEmpty = v =>
  v === undefined ||
  v === `` ||
  v === null ||
  (typeof v === `object` && !Object.entries(v).length);
const isNotEmpty = ({ value }) => !isEmpty(value);

const getBuildTypes = ({ buildType, ...props }) => {
  const { CODE, IMAGE, GIT } = BUILD_TYPES;
  const isRequired = type => type === buildType;
  return {
    // eslint-disable-next-line
    [CODE.field]: <CodeBuild required={isRequired(CODE.field)} {...props} />,
    // eslint-disable-next-line
    [IMAGE.field]: <ImageBuild required={isRequired(IMAGE.field)} {...props} />,
    // eslint-disable-next-line
    [GIT.field]: <GitBuild required={isRequired(GIT.field)} {...props} />,
  };
};
// #endregion

const AddAlgorithmForm = ({ onToggle, onSubmit }) => {
  const [form] = Form.useForm();
  form.setFieldsValue(formTemplate);

  const [fileList, setFileList] = useState([]);
  const [buildType, setBuildType] = useState(BUILD_TYPES.CODE.field);

  const onBuildTypeChange = e => setBuildType(e.target.value);

  // Injected from Form.create
  const { validateFields } = form;

  // #region  Submit Handle
  const buildTypes = getBuildTypes({
    buildType,
    fileList,
    setFileList,
  });

  const { applyAlgorithm } = useActions();

  const onFormSubmit = () => {
    validateFields().then(formObject => {
      if (buildType === BUILD_TYPES.CODE.field && !fileList.length) {
        notification({
          message: `Error`,
          description: `Please provide a file!`,
        });
        return;
      }

      // Reduce selected options to boolean entry
      const options = formObject.main.options.reduce(
        (acc, option) => ({ ...acc, [option]: true }),
        {}
      );

      // #region From Form-Object to Schema
      // On GIT build type:
      // [ env, entryPoint, baseImage ] are on the top object's keys level
      const { env, entryPoint, baseImage, ...rest } = formObject[buildType];

      /* eslint-disable indent */
      const payload =
        buildType === BUILD_TYPES.GIT.field
          ? {
              ...formObject.main,
              options,
              [BUILD_TYPES.GIT.field]: rest,
              env,
              entryPoint,
              baseImage,
            }
          : {
              ...formObject.main,
              options,
              ...formObject[buildType],
            };
      // #endregion

      if (buildType === BUILD_TYPES.GIT.field) {
        const commitObject = _.get(payload, BUILD_TYPES.GIT.COMMIT.field);
        if (commitObject.id === '') {
          delete payload.gitRepository.commit;
        }
      }

      const formData = new FormData();
      const [file] = fileList;
      if (buildType === BUILD_TYPES.CODE.field) {
        formData.append(`file`, file);
      }

      const payloadFiltered = mapObjValues({
        obj: payload,
        predicate: isNotEmpty,
      });
      formData.append(`payload`, stringify(payloadFiltered));

      applyAlgorithm(formData);

      onSubmit({ formData, payload: payloadFiltered });
    });
  };
  // #endregion

  return (
    <Form form={form} onFinish={onFormSubmit} style={{ display: 'contents' }}>
      <Form.Item
        name={splitByDot(MAIN.NAME.field)}
        label={MAIN.NAME.label}
        rules={[
          { required: true, message: MAIN.NAME.message, pattern: ALGO_REGEX },
        ]}>
        <Input placeholder={MAIN.NAME.placeholder} />
      </Form.Item>
      <Form.Item label="Build Type">
        <Radio.Group
          defaultValue={buildType}
          buttonStyle="solid"
          onChange={onBuildTypeChange}>
          {insertRadioButtons(buildTypes)}
        </Radio.Group>
      </Form.Item>
      <Form.Divider>{MAIN.DIVIDER.RESOURCES}</Form.Divider>
      <Form.Item name={splitByDot(MAIN.CPU.field)} label={MAIN.CPU.label}>
        <InputNumber min={0.1} />
      </Form.Item>
      <Form.Item name={splitByDot(MAIN.GPU.field)} label={MAIN.GPU.label}>
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        name={splitByDot(MAIN.MEMORY.field)}
        label={MAIN.MEMORY.label}
        labelAlign="left">
        <MemoryField>
          {MAIN.MEMORY.types.map(value => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </MemoryField>
      </Form.Item>
      <Form.Divider>{MAIN.DIVIDER.ADVANCED}</Form.Divider>
      <Form.Item
        name={splitByDot(MAIN.RESERVE_MEMORY.field)}
        label={MAIN.RESERVE_MEMORY.label}
        labelAlign="left">
        <MemoryField min={0} tooltipTitle={MAIN.RESERVE_MEMORY.tooltip}>
          {MAIN.RESERVE_MEMORY.types.map(value => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </MemoryField>
      </Form.Item>
      <Form.Item
        name={splitByDot(MAIN.WORKERS.field)}
        label={MAIN.WORKERS.label}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name={splitByDot(MAIN.OPTIONS.field)}
        label={MAIN.OPTIONS.label}
        initialValue={mainAdvancedOptions}>
        <Select mode="tags" placeholder={MAIN.OPTIONS.placeholder}>
          {insertAlgorithmOptions(MAIN.OPTIONS.types)}
        </Select>
      </Form.Item>
      {buildTypes[buildType]}
      <BottomPanel style={{ marginTop: 'auto' }}>
        <PanelButton onClick={onToggle}>Editor View</PanelButton>
        <RightAlignedButton type="primary" htmlType="submit">
          Submit
        </RightAlignedButton>
      </BottomPanel>
    </Form>
  );
};

AddAlgorithmForm.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line

  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

AddAlgorithmForm.defaultProps = {
  onSubmit: () => {},
};

export default memo(AddAlgorithmForm);
