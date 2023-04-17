import React, { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, InputNumber, Radio, Select, Checkbox } from 'antd';
import { Form, FlexBox } from 'components/common';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightPanel,
} from 'components/Drawer';
import formTemplate from 'config/template/addAlgorithmForm.template';

import {
  mapObjValues,
  notification,
  stringify,
  toUpperCaseFirstLetter,
  splitByDot,
  deepCopyFromKeyValue,
  flattenObjKeyValue,
} from 'utils';

import { CodeBuild, GitBuild, ImageBuild } from './BuildTypes';
import MemoryField from './MemoryField.react';
import schema from './schema';
import DrawerReadMeFile from '../../../components/Drawer/DrawerReadMeFile';

// #region  Helpers

const { MAIN, BUILD_TYPES } = schema;
const { Collapsible } = Form;
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

const toReadableBuildType = buildType => {
  let str = toUpperCaseFirstLetter(buildType);

  if (buildType === BUILD_TYPES.GIT.field) str = 'Git';

  if (buildType === BUILD_TYPES.IMAGE.field) str = 'Docker image';

  if (buildType === BUILD_TYPES.CODE.field) str = 'File';

  return str;
};

const toSelectedBuildType = buildType =>
  buildType.toLowerCase() === 'git'
    ? BUILD_TYPES.GIT.field
    : buildType.toLowerCase();

const insertRadioButtons = (buildTypes, selectedKey, isEdit) =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button
      key={key}
      value={key}
      disabled={isEdit && key !== selectedKey}>
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
    [GIT.field]: <GitBuild required={isRequired(GIT.field)} {...props} />,
    // eslint-disable-next-line
    [CODE.field]: <CodeBuild required={isRequired(CODE.field)} {...props} />,
    // eslint-disable-next-line
    [IMAGE.field]: <ImageBuild required={isRequired(IMAGE.field)} {...props} />,
  };
};
// #endregion

const AddAlgorithmForm = ({
  onToggle,
  onSubmit,
  isEdit,
  keyValueObject,
  isCheckForceStopAlgorithms,
  isSubmitLoading,
  setIsCheckForceStopAlgorithms,
  refCheckForceStopAlgorithms,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [buildType, setBuildType] = useState(
    (keyValueObject && toSelectedBuildType(keyValueObject?.type)) ||
      BUILD_TYPES.GIT.field
  );

  useMemo(() => {
    form.setFieldsValue(formTemplate);
  }, [form]);

  useEffect(() => {
    // init values in fields

    if (keyValueObject != null) {
      // Edit algorithm
      const schemaObjectForm = form.getFieldsValue();
      const objValuesForm = deepCopyFromKeyValue(
        schemaObjectForm,
        flattenObjKeyValue(keyValueObject)
      );
      setBuildType(toSelectedBuildType(keyValueObject.type));

      form.setFieldsValue(objValuesForm);
    } else {
      // add new algorithm
      form.setFieldsValue(formTemplate);
    }
  }, []);

  const onBuildTypeChange = e => setBuildType(e.target.value);

  // Injected from Form.create
  const { validateFields } = form;

  // #region  Submit Handle
  const buildTypes = getBuildTypes({
    buildType,
    fileList,
    setFileList,
    isEdit,
  });

  // const { applyAlgorithm } = useActions();
  const onFormSubmit = () => {
    validateFields().then(formObject => {
      if (buildType === BUILD_TYPES.CODE.field && !fileList.length && !isEdit) {
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
        <Input disabled={isEdit} placeholder={MAIN.NAME.placeholder} />
      </Form.Item>

      <FlexBox align="start">
        <FlexBox.Item span={18}>
          <Form.Item
            name={splitByDot(MAIN.DESCRIPTION.field)}
            label={MAIN.DESCRIPTION.label}>
            <Input
              placeholder={MAIN.DESCRIPTION.placeholder}
              style={{ marginLeft: '64px' }}
            />
          </Form.Item>
        </FlexBox.Item>
        <FlexBox.Item>
          <DrawerReadMeFile
            name={keyValueObject?.name || null}
            type="algorithms"
            disabled={!isEdit}
          />
        </FlexBox.Item>
      </FlexBox>

      <Form.Item label="Source">
        <Radio.Group
          defaultValue={buildType}
          buttonStyle="solid"
          onChange={onBuildTypeChange}>
          {insertRadioButtons(buildTypes, buildType, isEdit)}
        </Radio.Group>
      </Form.Item>

      {buildTypes[buildType]}

      <Collapsible title={MAIN.DIVIDER.RESOURCES}>
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
            {MAIN.MEMORY.types.map(valueItem => (
              <Select.Option key={valueItem} value={valueItem}>
                {valueItem}
              </Select.Option>
            ))}
          </MemoryField>
        </Form.Item>
      </Collapsible>
      <Collapsible title={MAIN.DIVIDER.ADVANCED}>
        <Form.Item
          name={splitByDot(MAIN.RESERVE_MEMORY.field)}
          label={MAIN.RESERVE_MEMORY.label}
          labelAlign="left">
          <MemoryField min={0} tooltipTitle={MAIN.RESERVE_MEMORY.tooltip}>
            {MAIN.RESERVE_MEMORY.types.map(valueItem => (
              <Select.Option key={valueItem} value={valueItem}>
                {valueItem}
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
      </Collapsible>

      <BottomPanel style={{ marginTop: 'auto' }}>
        <PanelButton onClick={onToggle}>Text editor</PanelButton>

        <RightPanel>
          {isEdit && (
            <Checkbox
              ref={refCheckForceStopAlgorithms}
              checked={isCheckForceStopAlgorithms}
              onClick={e => setIsCheckForceStopAlgorithms(e.target.checked)}>
              Stop running algorithms
            </Checkbox>
          )}

          <RightAlignedButton
            type="primary"
            htmlType="submit"
            loading={isSubmitLoading}
            disabled={isSubmitLoading}>
            Save
          </RightAlignedButton>
        </RightPanel>
      </BottomPanel>
    </Form>
  );
};

AddAlgorithmForm.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line

  keyValueObject: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  isEdit: PropTypes.bool.isRequired,
  refCheckForceStopAlgorithms: PropTypes.oneOfType([PropTypes.object])
    .isRequired,
  isCheckForceStopAlgorithms: PropTypes.bool.isRequired,
  isSubmitLoading: PropTypes.bool.isRequired,
  setIsCheckForceStopAlgorithms: PropTypes.func.isRequired,
};

AddAlgorithmForm.defaultProps = {
  onSubmit: () => {},

  keyValueObject: undefined,
};

export default memo(AddAlgorithmForm);
