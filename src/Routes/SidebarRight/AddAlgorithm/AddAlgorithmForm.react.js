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

  return (
    <Form form={form} onFinish={onFormSubmit} style={{ display: 'contents' }}>
      <ContenerForm>
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
        <FlexItemVolumes>
          <FlexBox.Item span={12}>
            <Card title="Volumes" bordered="true">
              <Form.Item style={{ width: '650px' }}>
                <VolumeList nameList={['main', 'volumes']} />
              </Form.Item>
            </Card>
          </FlexBox.Item>
          <FlexBox.Item span={12}>
            <Card
              title="Volumes Mounts"
              bordered="true"
              style={{ marginTop: '20px' }}>
              <Form.Item>
                <VolumeMountsList nameList={['main', 'volumeMounts']} />
              </Form.Item>
            </Card>
          </FlexBox.Item>
        </FlexItemVolumes>
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
        <Collapsible
          title="Environment Variable"
          defaultExpanded={
            keyValueFormObject?.main?.workerEnv?.length > 0 ||
            keyValueFormObject?.main?.algorithmEnv?.length > 0
          }>
          <Form.Item label="Worker">
            <KeyValueForm
              buttonWidth="395px"
              label={MAIN.WORKER_ENV.label}
              fieldName={splitByDot(MAIN.WORKER_ENV.field)}
              titleButtoAdd="Add"
            />
          </Form.Item>

          <Form.Item label="Algorithm">
            <KeyValueForm
              buttonWidth="395px"
              label={MAIN.ALGORITEM_ENV.label}
              fieldName={splitByDot(MAIN.ALGORITEM_ENV.field)}
              titleButtoAdd="Add"
            />
          </Form.Item>
        </Collapsible>

        <Collapsible
          title={
            <>
              {' '}
              Side Car{' '}
              <HelpSiteLink link="/learn/sidecars/#what-is-a-sidecar" />{' '}
            </>
          }
          defaultExpanded={keyValueFormObject?.main?.sideCars?.length > 0}>
          <SideCarForm nameList={splitByDot(MAIN.SIDECAR.field)} />
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
      </ContenerForm>
      <BottomPanel>
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
