import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, InputNumber, Radio, Select, Checkbox, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Form } from 'components/common';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightPanel,
} from 'components/Drawer';
import formTemplate from 'config/template/addAlgorithmForm.template';
import { useActions } from 'hooks';
import {
  mapObjValues,
  notification,
  stringify,
  toUpperCaseFirstLetter,
  splitByDot,
  deepCopyFromKeyValue,
  flattenObjKeyValue,
} from 'utils';
import client from 'client';
import { OVERVIEW_TABS } from 'const';
import usePath from './../../Tables/Algorithms/usePath';
import { CodeBuild, GitBuild, ImageBuild } from './BuildTypes';
import MemoryField from './MemoryField.react';
import schema from './schema';

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

const toReadableBuildType = buildType =>
  toUpperCaseFirstLetter(
    buildType === BUILD_TYPES.GIT.field ? `GIT` : buildType
  );

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

const AddAlgorithmForm = ({ onToggle, onSubmit, algorithmValue }) => {
  const isEdit = algorithmValue !== undefined;

  const keyValueObject =
    (algorithmValue && JSON.parse(algorithmValue)) || undefined;
  const [form] = Form.useForm();
  const [isCheckForceStopAlgorithms, setIsCheckForceStopAlgorithms] = useState(
    !isEdit
  );
  const refCheckForceStopAlgorithms = useRef(false);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
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

  const { applyAlgorithm } = useActions();
  const { goTo } = usePath();

  const onOverviewAlgorithm = useCallback(
    tab => {
      if (keyValueObject) {
        goTo.overview({
          nextAlgorithmId: keyValueObject?.name,
          nextTabKey: tab || OVERVIEW_TABS.VERSIONS,
        });
      }
    },
    [goTo, keyValueObject]
  );

  const onAfterSaveAlgorithm = useCallback(
    dataResponse => {
      setIsSubmitLoading(false);

      if (dataResponse.buildId) {
        onOverviewAlgorithm(OVERVIEW_TABS.BUILDS);
      }
    },
    [onOverviewAlgorithm]
  );

  const applyAlgorithmVersion = useCallback(
    dataResponse => {
      // create new version and apply version if force
      // const errorNotification = ({ message }) => notification({ message });
      client
        .post(`/versions/algorithms/apply`, {
          name: dataResponse.algorithm.name,
          version: dataResponse.algorithm.version,
          force: refCheckForceStopAlgorithms.current.state.checked,
        })
        .then(() => {
          setIsSubmitLoading(false);
          onAfterSaveAlgorithm(dataResponse);
        })
        .catch(error => {
          const { data } = error.response;

          Modal.confirm({
            title: 'WARNING : Version not upgrade',
            content: (
              <>
                <div>
                  <Text>{data.error.message}</Text>
                </div>
                <Checkbox
                  onClick={e => {
                    setIsCheckForceStopAlgorithms(e.target.checked);
                  }}>
                  Stop running algorithms.
                </Checkbox>
              </>
            ),
            okText: 'Try again',
            okType: 'danger',
            cancelText: 'Cancel',
            onCancel() {
              setIsSubmitLoading(false);
              onOverviewAlgorithm();
            },
            onOk() {
              setIsSubmitLoading(false);
              applyAlgorithmVersion(dataResponse);
            },
          });
        });
    },
    [onAfterSaveAlgorithm, onOverviewAlgorithm]
  );

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
      setIsSubmitLoading(true);
      if (isEdit) {
        applyAlgorithm(formData, res => {
          if (formData.buildId) {
            onOverviewAlgorithm(OVERVIEW_TABS.BUILDS);
          } else {
            applyAlgorithmVersion(res);
          }
        });
      } else {
        applyAlgorithm(formData, res => onAfterSaveAlgorithm(res));
      }

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
      <Form.Item label="Build Type">
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
        <PanelButton onClick={onToggle}>Editor View</PanelButton>

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
  algorithmValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

AddAlgorithmForm.defaultProps = {
  onSubmit: () => {},
  algorithmValue: undefined,
};

export default memo(AddAlgorithmForm);
