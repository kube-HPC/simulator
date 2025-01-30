import React, { memo, useEffect, useMemo, useState } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Input,
  InputNumber,
  Radio,
  Select,
  Checkbox,
  Button,
  Space,
  Divider,
} from 'antd';
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

const toSelectedBuildType = objKey =>
  (objKey && objKey.code) || objKey.type === 'code'
    ? BUILD_TYPES.CODE.field
    : objKey.image || objKey.algorithmImage || objKey.type === 'image'
      ? BUILD_TYPES.IMAGE.field
      : BUILD_TYPES.GIT.field || BUILD_TYPES.GIT.field;

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

const lastElementStyle = {
  position: 'absolute',
  right: 260,
  top: '50%',
  transform: 'translateY(-50%)',
};

const AddAlgorithmForm = ({
  onToggle,
  onSubmit = () => {},
  isEdit,
  keyValueFormObject = undefined,
  isCheckForceStopAlgorithms,
  isSubmitLoading,
  setIsCheckForceStopAlgorithms,
  refCheckForceStopAlgorithms,
  fileList,
  setFileList,
}) => {
  const [form] = Form.useForm();

  const [buildType, setBuildType] = useState(
    (keyValueFormObject && toSelectedBuildType(keyValueFormObject)) ||
      BUILD_TYPES.GIT.field
  );

  useMemo(() => {
    form.setFieldsValue(formTemplate);
  }, [form]);

  const onToggleToEditor = () => {
    const schemaObjectForm = form.getFieldsValue();
    onToggle(schemaObjectForm, buildType);
  };

  useEffect(() => {
    // init values in fields

    if (keyValueFormObject != null) {
      //   const schemaObjectForm = form.getFieldsValue();

      // Edit algorithm
      // const objValuesForm = convertJsonToForm(keyValueFormObject);

      //  const objValuesForm = deepCopyFromKeyValue(
      //    schemaObjectForm,
      //     flattenObjKeyValue(keyValueObject)
      //   );

      //   const optionsData = keyValueObject.options ? Object.keys(keyValueObject?.options) : keyValueObject?.main?.options;

      //   objValuesForm.main.options = optionsData.filter(item =>
      //     MAIN.OPTIONS.types.includes(item)
      //   );

      //   setBuildType(toSelectedBuildType(keyValueObject));

      form.setFieldsValue(keyValueFormObject);
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
    // Form submit
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

      if (payload.option) {
        const payloadFilteredOption = mapObjValues({
          obj: payload.option,
          predicate: isNotEmpty,
        });

        payload.option = payloadFilteredOption;
      }

      formData.append(`payload`, stringify(payload));
      onSubmit({ formData, payload });
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
            name={keyValueFormObject?.name || null}
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
      <Collapsible title="Side Car">
        <Form.List name={splitByDot(MAIN.SIDECAR.field)}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <>
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}
                    align="baseline">
                    <Form.Item
                      label="Name"
                      {...restField}
                      name={[name, 'name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing name',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <>Container</>
                    <Form.Item
                      label="Container Name"
                      {...restField}
                      name={[name, 'containerName']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing container name',
                        },
                      ]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Container Image"
                      {...restField}
                      name={[name, 'container Image']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing image',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <>Volumes</>
                    <Form.Item
                      label="volumes Name"
                      {...restField}
                      name={[name, 'volumes Name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing volumes name',
                        },
                      ]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="volumes volumeType"
                      {...restField}
                      name={[name, 'volumes volumeType']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing volumes volumeType',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <>volume Mounts</>
                    <Form.Item
                      label="Volumes Name"
                      {...restField}
                      name={[name, 'volumeMounts Name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing volumeMounts name',
                        },
                      ]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="volumeMounts mountPath"
                      {...restField}
                      name={[name, 'volumeMounts mountPath']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing volumeMounts mountPath',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <>environments</>
                    <Form.Item
                      label="environments name"
                      {...restField}
                      name={[name, 'environments name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing environments name',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="environments value"
                      {...restField}
                      name={[name, 'environments value']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing environments value',
                        },
                      ]}>
                      <Input />
                    </Form.Item>

                    <MinusCircleOutlined
                      style={lastElementStyle}
                      onClick={() => remove(name)}
                    />
                  </Space>
                  <Divider />
                </>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}>
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Collapsible>

      <BottomPanel style={{ marginTop: 'auto' }}>
        <PanelButton onClick={onToggleToEditor}>Text editor</PanelButton>

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

  keyValueFormObject: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  isEdit: PropTypes.bool.isRequired,
  refCheckForceStopAlgorithms: PropTypes.oneOfType([PropTypes.object])
    .isRequired,
  isCheckForceStopAlgorithms: PropTypes.bool.isRequired,
  isSubmitLoading: PropTypes.bool.isRequired,
  setIsCheckForceStopAlgorithms: PropTypes.func.isRequired,
  fileList: PropTypes.oneOfType([PropTypes.object]).isRequired,
  setFileList: PropTypes.func.isRequired,
};

export default memo(AddAlgorithmForm);
