import React, { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, InputNumber, Radio, Select, Checkbox, Card } from 'antd';
import { Form, FlexBox, HelpSiteLink } from 'components/common';
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
  transformFieldsToObject,
  setTypeVolume,
} from 'utils';

import KeyValueForm from 'components/common/KeyValueForm';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { CodeBuild, GitBuild, ImageBuild } from './BuildTypes';
import MemoryField from './MemoryField.react';
import schema from './schema';
import DrawerReadMeFile from '../../../components/Drawer/DrawerReadMeFile';

import SideCarForm from './SideCarForm';
import VolumeList from './VolumeList';
import VolumeMountsList from './VolumeMountsList';

const FlexItemVolumes = styled.div`
  display: flex;
  align-content: flex-start;
  align-items: baseline;
  justify-content: space-around;
  gap: 10px;
`;

const ContenerForm = styled.div`
  height: -webkit-fill-available;
  overflow-y: scroll;
  padding-right: 5px;
  overflow-x: hidden;
  padding-right: 20px;
`;
// #region  Helpers

const { MAIN, BUILD_TYPES } = schema;
const { Collapsible } = Form;
// https://github.com/kube-HPC/hkube/blob/master/core/api-server/lib/consts/regex.js
const ALGO_REGEX = /^[a-z0-9][-a-z0-9\\.]*[a-z0-9]$/;
const DEFAULT_KAI_QUEUE = 'default';

const mainAdvancedOptions = Object.entries(formTemplate.main.options)
  .filter(([, isAvailable]) => isAvailable)
  .map(([key]) => key);

const insertAlgorithmOptions = options =>
  options.map(option => ({
    value: option,
    label: toUpperCaseFirstLetter(option),
  }));

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

const insertResourceModeButtons = resourceModes =>
  resourceModes.map(mode => (
    <Radio.Button key={mode.value} value={mode.value}>
      {mode.label}
    </Radio.Button>
  ));

const isEmpty = v =>
  v === undefined ||
  v === `` ||
  v === null ||
  (typeof v === `object` && !Object.entries(v).length);
const isNotEmpty = ({ value }) => !isEmpty(value);

const hasKaiObject = kaiObject => {
  if (!kaiObject || typeof kaiObject !== 'object') return false;

  return Object.values(kaiObject).some(value => !isEmpty(value));
};

const getKaiAllocationType = kaiObject => {
  if (!kaiObject || typeof kaiObject !== 'object') {
    return MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY;
  }

  return !isEmpty(kaiObject.fraction)
    ? MAIN.KAI_OBJECT.ALLOCATION_TYPE.FRACTION
    : MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY;
};

const normalizeKaiObjectFormValues = kaiObject => {
  if (!kaiObject) {
    return formTemplate.main.kaiObject;
  }

  const allocationType =
    kaiObject.allocationType || getKaiAllocationType(kaiObject);

  return {
    ...formTemplate.main.kaiObject,
    ...kaiObject,
    allocationType,
    memory:
      allocationType === MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY
        ? kaiObject.memory || formTemplate.main.kaiObject.memory
        : undefined,
    fraction:
      allocationType === MAIN.KAI_OBJECT.ALLOCATION_TYPE.FRACTION
        ? kaiObject.fraction
        : undefined,
  };
};

const getResourceMode = main => {
  if (main?.resourceMode) {
    return main.resourceMode;
  }

  return hasKaiObject(main?.kaiObject)
    ? MAIN.RESOURCE_MODE.KAI
    : MAIN.RESOURCE_MODE.GPU;
};

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

/*
const lastElementStyle = {
  position: 'absolute',
  right: 260,
  top: '50%',
  transform: 'translateY(-50%)',
};
*/

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

  const [searchParams] = useSearchParams();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [isErrorEnvironmentVariable, setIsErrorEnvironmentVariable] = useState(
    keyValueFormObject?.main?.workerEnv?.length > 0 ||
      keyValueFormObject?.main?.algorithmEnv?.length > 0
  );
  const [isErrorSideCar, setIsErrorSideCar] = useState(
    keyValueFormObject?.main?.sideCars?.length > 0
  );
  const [buildType, setBuildType] = useState(
    (keyValueFormObject && toSelectedBuildType(keyValueFormObject)) ||
      BUILD_TYPES.GIT.field
  );
  const [resourceMode, setResourceMode] = useState(
    getResourceMode(keyValueFormObject?.main || formTemplate.main)
  );
  const [kaiAllocationType, setKaiAllocationType] = useState(
    getKaiAllocationType(keyValueFormObject?.main?.kaiObject)
  );

  const withDefaultKaiQueue = kaiObject => {
    if (isEdit) return kaiObject;

    return isEmpty(kaiObject?.queue)
      ? { ...kaiObject, queue: DEFAULT_KAI_QUEUE }
      : kaiObject;
  };

  useMemo(() => {
    form.setFieldsValue(formTemplate);
  }, [form]);

  const onToggleToEditor = () => {
    const schemaObjectForm = form.getFieldsValue();
    onToggle(schemaObjectForm, buildType);
  };

  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'advanced') {
      setIsAdvancedOpen(true);
    }
  }, [searchParams]);

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

      const normalizedFormValues = {
        ...keyValueFormObject,
        main: {
          ...keyValueFormObject.main,
          kaiObject: normalizeKaiObjectFormValues(
            keyValueFormObject.main?.kaiObject
          ),
        },
      };

      form.setFieldsValue(normalizedFormValues);
      setResourceMode(getResourceMode(keyValueFormObject.main));
      setKaiAllocationType(
        getKaiAllocationType(keyValueFormObject.main?.kaiObject)
      );
    } else {
      // add new algorithm
      form.setFieldsValue({
        ...formTemplate,
        main: {
          ...formTemplate.main,
          kaiObject: withDefaultKaiQueue(formTemplate.main.kaiObject),
        },
      });
      setResourceMode(getResourceMode(formTemplate.main));
      setKaiAllocationType(getKaiAllocationType(formTemplate.main.kaiObject));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBuildTypeChange = e => setBuildType(e.target.value);

  const onResourceModeChange = e => {
    const nextResourceMode = e.target.value;
    setResourceMode(nextResourceMode);

    if (nextResourceMode === MAIN.RESOURCE_MODE.KAI) {
      const currentKaiObject = form.getFieldValue(['main', 'kaiObject']);
      const nextAllocationType =
        currentKaiObject?.allocationType || kaiAllocationType;
      const normalizedKaiObject = withDefaultKaiQueue(
        normalizeKaiObjectFormValues({
          ...currentKaiObject,
          allocationType: nextAllocationType,
        })
      );

      form.setFieldsValue({
        main: {
          gpu: 0,
          kaiObject: normalizedKaiObject,
        },
      });
      setKaiAllocationType(nextAllocationType);
      return;
    }

    form.setFieldsValue({
      main: {
        kaiObject: {
          queue: '',
          allocationType: MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY,
          memory: '256Mi',
          fraction: undefined,
        },
      },
    });
    setKaiAllocationType(MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY);
  };

  const onKaiAllocationTypeChange = e => {
    const nextAllocationType = e.target.value;
    const currentKaiObject = form.getFieldValue(['main', 'kaiObject']) || {};

    setKaiAllocationType(nextAllocationType);
    form.setFieldsValue({
      main: {
        kaiObject: normalizeKaiObjectFormValues({
          ...currentKaiObject,
          allocationType: nextAllocationType,
        }),
      },
    });
  };

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

      delete payload.resourceMode;

      if (resourceMode === MAIN.RESOURCE_MODE.KAI) {
        const { allocationType, ...kaiObject } = formObject.main.kaiObject;

        payload.kaiObject = {
          queue: kaiObject?.queue?.trim(),
          ...(allocationType === MAIN.KAI_OBJECT.ALLOCATION_TYPE.FRACTION
            ? { fraction: kaiObject.fraction }
            : {
                memory: kaiObject.memory || formTemplate.main.kaiObject.memory,
              }),
        };
        delete payload.gpu;
      } else {
        payload.gpu = formObject.main.gpu;
        delete payload.kaiObject;
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

      // Submit sidecar to json ---------------------------------------------------------------

      payload.sideCars = formObject?.main?.sideCars?.map(sideCar => {
        const sideCarObj = {};

        if (sideCar?.container) {
          sideCarObj.container = sideCar.container;
        }

        //    if (sideCar?.volumes) {
        //      sideCarObj.volumes = setTypeVolume(sideCar.volumes);
        //    }

        if (sideCar?.volumeMounts) {
          sideCarObj.volumeMounts = sideCar.volumeMounts;
        }

        if (sideCar?.environments) {
          sideCarObj.environments = transformFieldsToObject(
            sideCar.environments
          );
        }

        return sideCarObj;
      });

      // ------------------------------------------------------------------------------ end sidecar

      // External Volumes
      if (formObject?.main.volumes) {
        payload.volumes = setTypeVolume(formObject.main.volumes);
      }

      if (formObject?.main.volumeMounts) {
        payload.volumeMounts = formObject.main.volumeMounts;
      }
      // End External Volumes

      // workerEnv
      if (
        formObject?.main?.workerEnv &&
        Object.keys(formObject.main.workerEnv).length > 0
      ) {
        payload.workerEnv = transformFieldsToObject(formObject.main.workerEnv);
      } else {
        payload.workerEnv = {};
      }

      // algorithmEnv
      if (
        formObject?.main?.algorithmEnv &&
        Object.keys(formObject.main.algorithmEnv).length > 0
      ) {
        payload.algorithmEnv = transformFieldsToObject(
          formObject.main.algorithmEnv
        );
      } else {
        payload.algorithmEnv = {};
      }

      formData.append(`payload`, stringify(payload));
      onSubmit({ formData, payload });
    });
  };
  // #endregion

  const openCollapsibleContainingField = namePath => {
    if (
      namePath.includes('main_workerEnv') ||
      namePath.includes('main_algorithmEnv')
    ) {
      setIsErrorEnvironmentVariable(true);
    }

    if (namePath.includes('main_sideCars')) {
      setIsErrorSideCar(true);
    }
  };

  const handleFinishFailed = ({ errorFields }) => {
    if (!errorFields.length) return;

    const fieldName = errorFields[0].name;
    const namePath = fieldName.join('_');

    openCollapsibleContainingField(namePath);

    form.scrollToField(fieldName);

    setTimeout(() => {
      const input =
        document.querySelector(`[id$='${namePath}']`) ||
        document.querySelector(`[name='${namePath}']`);
      if (input) {
        input.focus();
      }
    }, 400);
  };

  return (
    <Form
      form={form}
      onFinish={onFormSubmit}
      style={{ display: 'contents' }}
      onFinishFailed={handleFinishFailed}>
      <ContenerForm>
        <Form.Item
          name={splitByDot(MAIN.NAME.field)}
          label={MAIN.NAME.label}
          rules={[
            { required: true, message: MAIN.NAME.message, pattern: ALGO_REGEX },
          ]}>
          <Input
            disabled={isEdit}
            placeholder={MAIN.NAME.placeholder}
            data-testid="add-algorithm-main-name-input"
          />
        </Form.Item>
        <FlexBox align="start">
          <FlexBox.Item span={18}>
            <Form.Item
              name={splitByDot(MAIN.DESCRIPTION.field)}
              label={MAIN.DESCRIPTION.label}>
              <Input
                placeholder={MAIN.DESCRIPTION.placeholder}
                style={{ marginLeft: '60px' }}
                data-testid="add-algorithm-main-description-input"
              />
            </Form.Item>
          </FlexBox.Item>
          <FlexBox.Item>
            <DrawerReadMeFile
              name={keyValueFormObject?.main?.name || null}
              type="algorithms"
              disabled={!isEdit}
            />
          </FlexBox.Item>
        </FlexBox>
        <Form.Item label="Source">
          <Radio.Group
            data-testid="add-algorithm-source-type-radio-group"
            defaultValue={buildType}
            buttonStyle="solid"
            onChange={onBuildTypeChange}>
            {insertRadioButtons(buildTypes, buildType, isEdit)}
          </Radio.Group>
        </Form.Item>
        {buildTypes[buildType]}
        <FlexItemVolumes>
          <FlexBox.Item span={12}>
            <Card title="Volumes" variant="default">
              <Form.Item style={{ width: '650px' }}>
                <VolumeList
                  nameList={['main', 'volumes']}
                  testIdPrefix="add-algorithm-main-volumes"
                />
              </Form.Item>
            </Card>
          </FlexBox.Item>
          <FlexBox.Item span={12}>
            <Card
              title="Volumes Mounts"
              variant="default"
              style={{ marginTop: '20px' }}>
              <Form.Item>
                <VolumeMountsList
                  nameList={['main', 'volumeMounts']}
                  testIdPrefix="add-algorithm-main-volume-mounts"
                />
              </Form.Item>
            </Card>
          </FlexBox.Item>
        </FlexItemVolumes>
        <Collapsible title={MAIN.DIVIDER.RESOURCES}>
          <Form.Item name={splitByDot(MAIN.CPU.field)} label={MAIN.CPU.label}>
            <InputNumber min={0.1} data-testid="add-algorithm-main-cpu-input" />
          </Form.Item>

          <Form.Item
            name={splitByDot(MAIN.MEMORY.field)}
            label={MAIN.MEMORY.label}
            labelAlign="left">
            <MemoryField
              testId="add-algorithm-main-memory"
              options={MAIN.MEMORY.types.map(valueItem => ({
                value: valueItem,
                label: valueItem,
              }))}
            />
          </Form.Item>
        </Collapsible>
        <Collapsible
          title={
            <>
              {MAIN.DIVIDER.GPUMANAGER}
              <HelpSiteLink link="/learn/kai/#what-is-kai-scheduler" />
            </>
          }>
          <Form.Item
            name={splitByDot(MAIN.RESOURCE_MODE.field)}
            label={MAIN.RESOURCE_MODE.label}
            initialValue={resourceMode}>
            <Radio.Group
              buttonStyle="solid"
              data-testid="add-algorithm-main-resource-mode-radio-group"
              onChange={onResourceModeChange}>
              {insertResourceModeButtons([
                {
                  value: MAIN.RESOURCE_MODE.GPU,
                  label: 'GPU',
                },
                {
                  value: MAIN.RESOURCE_MODE.KAI,
                  label: 'KAI',
                },
              ])}
            </Radio.Group>
          </Form.Item>

          {resourceMode === MAIN.RESOURCE_MODE.GPU && (
            <Form.Item
              name={splitByDot(MAIN.GPU.field)}
              label={MAIN.GPU.label}
              rules={[{ required: true, message: 'GPU is required' }]}>
              <InputNumber min={0} data-testid="add-algorithm-main-gpu-input" />
            </Form.Item>
          )}

          {resourceMode === MAIN.RESOURCE_MODE.KAI && (
            <>
              <Form.Item
                name={splitByDot(MAIN.KAI_OBJECT.QUEUE.field)}
                label={MAIN.KAI_OBJECT.QUEUE.label}
                rules={[
                  {
                    required: true,
                    message: MAIN.KAI_OBJECT.QUEUE.message,
                  },
                ]}>
                <Input
                  placeholder={MAIN.KAI_OBJECT.QUEUE.placeholder}
                  data-testid="add-algorithm-main-kai-queue-input"
                />
              </Form.Item>
              <Form.Item
                label={MAIN.KAI_OBJECT.ALLOCATION_TYPE.label}
                style={{ marginBottom: 0 }}
                required>
                <Form.Item
                  name={splitByDot(MAIN.KAI_OBJECT.ALLOCATION_TYPE.field)}
                  initialValue={kaiAllocationType}
                  style={{
                    display: 'inline-block',
                    width: 'calc(20%)',
                    padding: '0px',
                    margin: '0px',
                  }}>
                  <Radio.Group
                    buttonStyle="solid"
                    data-testid="add-algorithm-main-kai-allocation-type-radio-group"
                    onChange={onKaiAllocationTypeChange}>
                    {insertResourceModeButtons([
                      {
                        value: MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY,
                        label: 'Memory',
                      },
                      {
                        value: MAIN.KAI_OBJECT.ALLOCATION_TYPE.FRACTION,
                        label: 'Fraction',
                      },
                    ])}
                  </Radio.Group>
                </Form.Item>

                {kaiAllocationType ===
                MAIN.KAI_OBJECT.ALLOCATION_TYPE.MEMORY ? (
                  <Form.Item
                    name={splitByDot(MAIN.KAI_OBJECT.MEMORY.field)}
                    label=""
                    rules={[
                      {
                        required: true,
                        message: MAIN.KAI_OBJECT.MEMORY.message,
                      },
                    ]}
                    labelAlign="left"
                    style={{
                      display: 'inline-block',
                      width: 'calc(50%)',
                    }}>
                    <MemoryField
                      testId="add-algorithm-main-kai-memory"
                      options={MAIN.MEMORY.types.map(valueItem => ({
                        value: valueItem,
                        label: valueItem,
                      }))}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name={splitByDot(MAIN.KAI_OBJECT.FRACTION.field)}
                    label=""
                    rules={[
                      {
                        required: true,
                        message: MAIN.KAI_OBJECT.FRACTION.message,
                      },
                    ]}
                    style={{
                      display: 'inline-block',
                      width: 'calc(60%)',
                    }}>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.1}
                      placeholder={MAIN.KAI_OBJECT.FRACTION.placeholder}
                      data-testid="add-algorithm-main-kai-fraction-input"
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </>
          )}
        </Collapsible>
        <Collapsible
          title="Environment Variable"
          expanded={isErrorEnvironmentVariable}
          onChange={val => setIsErrorEnvironmentVariable(val)}>
          <Form.Item label="Worker">
            <KeyValueForm
              buttonWidth="395px"
              label={MAIN.WORKER_ENV.label}
              fieldName={splitByDot(MAIN.WORKER_ENV.field)}
              titleButtoAdd="Add"
              testIdPrefix="add-algorithm-main-worker-env"
            />
          </Form.Item>

          <Form.Item label="Algorithm">
            <KeyValueForm
              buttonWidth="395px"
              label={MAIN.ALGORITEM_ENV.label}
              fieldName={splitByDot(MAIN.ALGORITEM_ENV.field)}
              titleButtoAdd="Add"
              testIdPrefix="add-algorithm-main-algorithm-env"
            />
          </Form.Item>
        </Collapsible>
        <Collapsible
          title={
            <>
              Side Car
              <HelpSiteLink link="/learn/sidecars/#what-is-a-sidecar" />{' '}
            </>
          }
          onChange={val => setIsErrorSideCar(val)}
          expanded={isErrorSideCar}>
          <SideCarForm
            nameList={splitByDot(MAIN.SIDECAR.field)}
            testIdPrefix="add-algorithm-main-sidecar"
          />
        </Collapsible>
        <Collapsible
          title={MAIN.DIVIDER.ADVANCED}
          expanded={isAdvancedOpen}
          onChange={val => setIsAdvancedOpen(val)}>
          <Form.Item
            name={splitByDot(MAIN.RESERVE_MEMORY.field)}
            label={MAIN.RESERVE_MEMORY.label}
            labelAlign="left">
            <MemoryField
              min={0}
              testId="add-algorithm-main-reserve-memory"
              tooltipTitle={MAIN.RESERVE_MEMORY.tooltip}
              options={MAIN.RESERVE_MEMORY.types.map(valueItem => ({
                value: valueItem,
                label: valueItem,
              }))}
            />
          </Form.Item>
          <Form.Item
            name={splitByDot(MAIN.WORKERS.field)}
            label={MAIN.WORKERS.label}>
            <InputNumber
              min={0}
              data-testid="add-algorithm-main-workers-input"
            />
          </Form.Item>
          <Form.Item
            name={splitByDot(MAIN.OPTIONS.field)}
            label={MAIN.OPTIONS.label}
            initialValue={mainAdvancedOptions}>
            <Select
              data-testid="add-algorithm-main-options-select"
              mode="tags"
              placeholder={MAIN.OPTIONS.placeholder}
              options={insertAlgorithmOptions(MAIN.OPTIONS.types)}
            />
          </Form.Item>
        </Collapsible>
      </ContenerForm>
      <BottomPanel>
        <PanelButton onClick={onToggleToEditor}>Text editor</PanelButton>

        <RightPanel>
          {isEdit && (
            <Checkbox
              data-testid="add-algorithm-stop-running-checkbox"
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
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFileList: PropTypes.func.isRequired,
};

export default memo(AddAlgorithmForm);
