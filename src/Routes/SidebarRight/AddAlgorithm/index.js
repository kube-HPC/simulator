import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import client from 'client';
import { errorsCode } from '@hkube/consts';
import PropTypes from 'prop-types';
import { Checkbox, Modal, message } from 'antd';
import Text from 'antd/lib/typography/Text';
import { addAlgorithmTemplate } from 'config';
import {
  stringify,
  transformFieldsToObject,
  transformObjectToArray,
  setTypeVolume,
} from 'utils'; // mergeObjects, tryParseJson
import { OVERVIEW_TABS } from 'const';
import usePath from './../../Tables/Algorithms/usePath';
import AddAlgorithmForm from './AddAlgorithmForm.react';
import AlgorithmJsonEditor from './AlgorithmJsonEditor';
import schema from './schema';

const { MAIN, BUILD_TYPES } = schema;

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);

const AddAlgorithm = ({ algorithmValue = undefined }) => {
  // #region  Editor State
  const refCheckForceStopAlgorithms = useRef(false);

  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(algorithmValue !== undefined);
  const [editorIsVisible, setEditorIsVisible] = useState(
    algorithmValue !== undefined
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCheckForceStopAlgorithms, setIsCheckForceStopAlgorithms] =
    useState(!isEdit);
  const [keyValueFormObject, setKeyValueFormObject] = useState(
    (algorithmValue && JSON.parse(algorithmValue)) || undefined
  );
  const [editorJsonValue, setEditorJsonValue] = useState(
    algorithmValue || DEFAULT_EDITOR_VALUE
  );
  const toggleEditor = () => setEditorIsVisible(prev => !prev);
  const [fileList, setFileList] = useState([]);

  // switch from Form Object to Json

  const switchToJson = (formObj, type) => {
    const objJsonData = JSON.parse(editorJsonValue);
    objJsonData.name = formObj.main.name;

    // sidecar to json ---------------------------------------------------------------

    objJsonData.sideCars = formObj?.main?.sideCars?.map(sideCar => {
      const sideCarObj = {};

      if (sideCar?.container) {
        sideCarObj.container = sideCar.container;
      }

      // if (sideCar?.volumes) {
      //   sideCarObj.volumes = setTypeVolume(sideCar.volumes);
      // }

      if (sideCar?.volumeMounts) {
        sideCarObj.volumeMounts = sideCar.volumeMounts;
      }

      if (sideCar?.environments) {
        sideCarObj.environments = transformFieldsToObject(sideCar.environments);
      }

      return sideCarObj;
    });

    // ------------------------------------------------------------------------------ end sidecar

    // External Volumes
    if (formObj.main?.volumes) {
      objJsonData.volumes = setTypeVolume(formObj.main.volumes);
    }

    if (formObj.main?.volumeMounts) {
      objJsonData.volumeMounts = formObj.main.volumeMounts;
    }
    // End External Volumes

    objJsonData.cpu = formObj.main.cpu;
    objJsonData.gpu = formObj.main.gpu;
    objJsonData.mem = formObj.main.mem;
    objJsonData.minHotWorkers = formObj.main.minHotWorkers;

    // workerEnv
    if (
      formObj?.main?.workerEnv &&
      Object.keys(formObj.main.workerEnv).length > 0
    ) {
      objJsonData.workerEnv = transformFieldsToObject(formObj.main.workerEnv);
    } else {
      objJsonData.workerEnv = {};
    }

    // algorithmEnv
    if (
      formObj?.main?.algorithmEnv &&
      Object.keys(formObj.main.algorithmEnv).length > 0
    ) {
      objJsonData.algorithmEnv = transformFieldsToObject(
        formObj.main.algorithmEnv
      );
    } else {
      objJsonData.algorithmEnv = {};
    }

    objJsonData.reservedMemory = formObj.main.reservedMemory;

    // Reduce selected options to boolean entry
    objJsonData.options = {
      ...objJsonData.options,
      ...formObj.main.options.reduce(
        (acc, option) => ({ ...acc, [option]: true }),
        {}
      ),
    };

    // Code
    if (type === BUILD_TYPES.CODE.field) {
      delete objJsonData.gitRepository;
      delete objJsonData.image;

      objJsonData.type = 'Code';
      objJsonData.env = formObj.code.env;
      objJsonData.entryPoint = formObj.code.entryPoint;
      objJsonData.baseImage = formObj.code.baseImage; // put base image in root
    }

    // Image
    if (type === BUILD_TYPES.IMAGE.field) {
      delete objJsonData.gitRepository;

      objJsonData.type = 'Image';

      objJsonData.algorithmImage = formObj.image.algorithmImage;
    }

    // Git
    if (type === BUILD_TYPES.GIT.field) {
      objJsonData.gitRepository = objJsonData?.gitRepository || {};
      objJsonData.gitRepository.commit =
        objJsonData?.gitRepository.commit || {};

      objJsonData.type = 'Git';
      objJsonData.gitRepository.commit.id = formObj.gitRepository.commit.id;
      objJsonData.gitRepository.branchName = formObj.gitRepository.branchName;
      objJsonData.gitRepository.gitKind = formObj.gitRepository.gitKind;
      objJsonData.gitRepository.tag = formObj.gitRepository.tag;
      objJsonData.gitRepository.token = formObj.gitRepository.token;
      objJsonData.gitRepository.url = formObj.gitRepository.url;

      objJsonData.baseImage = formObj.gitRepository.baseImage; // put base image in root
      objJsonData.entryPoint = formObj.gitRepository.entryPoint;
      objJsonData.env = formObj.gitRepository.env;

      delete objJsonData.gitRepository.entryPoint;
    }

    setEditorJsonValue(stringify(objJsonData));
    toggleEditor(prev => !prev);
  };

  const addTypeVolume = (objVolumes = []) =>
    objVolumes.map(obj => {
      if (!obj || typeof obj !== 'object') return obj;

      const typeVolume = obj.persistentVolumeClaim
        ? 'persistentVolumeClaim'
        : obj.configMap
          ? 'configMap'
          : obj.secret
            ? 'secret'
            : 'emptyDir';

      const newObj = { ...obj, typeVolume };
      //  if (newObj[typeVolume] && typeof newObj[typeVolume] === 'object') {
      //      newObj[typeVolume] = JSON.stringify(newObj[typeVolume]);
      //   }

      return newObj;
    });

  const switchToForm = () => {
    // switch from JSON Object To Form
    const objJsonData = JSON.parse(editorJsonValue);
    const formObj = {};
    formObj.main = {};

    formObj.main.name = objJsonData.name;

    // sidecar to object ui

    formObj.main.sideCars = objJsonData?.sideCars?.map(sideCar => ({
      container: sideCar?.container,
      //  volumes: addTypeVolume(sideCar.volumes),
      volumeMounts: sideCar.volumeMounts,
      environments: transformObjectToArray(sideCar.environments),
    }));

    // -------------------------------------------------------------- end sidecar

    // External Volumes
    if (objJsonData?.volumes) {
      formObj.main.volumes = addTypeVolume(objJsonData.volumes);
    }

    if (objJsonData?.volumeMounts) {
      formObj.main.volumeMounts = objJsonData.volumeMounts;
    }
    // End External Volumes

    formObj.main.description = objJsonData.description;

    formObj.main.cpu = objJsonData.cpu;
    formObj.main.gpu = objJsonData.gpu;
    formObj.main.mem = objJsonData.mem;
    formObj.main.minHotWorkers = objJsonData.minHotWorkers;
    formObj.main.workerEnv =
      objJsonData.workerEnv && transformObjectToArray(objJsonData.workerEnv);
    formObj.main.algorithmEnv =
      objJsonData.algorithmEnv &&
      transformObjectToArray(objJsonData.algorithmEnv);
    formObj.main.reservedMemory = objJsonData.reservedMemory;

    formObj.main.options = objJsonData?.options
      ? Object.keys(objJsonData?.options).filter(item =>
          MAIN.OPTIONS.types.includes(item)
        )
      : {};

    // Code
    if (objJsonData.type === BUILD_TYPES.CODE.label || objJsonData.code) {
      formObj.code = {};

      formObj.code.env = objJsonData.env;
      formObj.code.entryPoint = objJsonData.entryPoint;
      formObj.code.baseImage = objJsonData.baseImage;
    }

    // Image
    if (objJsonData.type === BUILD_TYPES.IMAGE.label || objJsonData.image) {
      formObj.image = {};

      formObj.image.algorithmImage = objJsonData.algorithmImage;
    }

    // Git
    if (
      objJsonData.type === BUILD_TYPES.GIT.label ||
      objJsonData.gitRepository
    ) {
      formObj.gitRepository = {};
      formObj.gitRepository.commit = {};

      formObj.gitRepository.commit.id = objJsonData.gitRepository.commit.id;
      formObj.gitRepository.baseImage = objJsonData.baseImage;
      formObj.gitRepository.branchName = objJsonData.gitRepository.branchName;
      formObj.gitRepository.gitKind = objJsonData.gitRepository.gitKind;
      formObj.gitRepository.tag = objJsonData.gitRepository.tag;
      formObj.gitRepository.token = objJsonData.gitRepository.token;
      formObj.gitRepository.url = objJsonData.gitRepository.url;

      formObj.gitRepository.entryPoint = objJsonData.entryPoint;
      formObj.gitRepository.env = objJsonData.env;
    }

    setKeyValueFormObject(formObj);
    toggleEditor(prev => !prev);
  };

  const { goTo } = usePath();

  const onOverviewAlgorithm = useCallback(
    (tab, name) => {
      if (keyValueFormObject || name) {
        goTo.overview({
          nextAlgorithmId: keyValueFormObject?.name || name,
          nextTabKey: tab || OVERVIEW_TABS.VERSIONS,
        });
      }
    },
    [goTo, keyValueFormObject]
  );

  const onAfterSaveAlgorithm = useCallback(
    dataResponse => {
      let isMsgApplied = true;

      const buildId = dataResponse?.buildId || null;

      if (
        dataResponse?.messagesCode?.includes(errorsCode.NO_TRIGGER_FOR_BUILD)
      ) {
        message.warning(
          'No trigger for build since there was not change in uploaded file.'
        );
        isMsgApplied = false;
      }

      if (buildId) {
        onOverviewAlgorithm(OVERVIEW_TABS.BUILDS, dataResponse.algorithm.name);
      }

      if (isMsgApplied) {
        if (dataResponse?.error?.code === 400) {
          message.error(dataResponse?.error?.message || 'Something is wrong!');
        } else {
          message.success('Algorithm Applied, check Algorithms table');
        }
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
          force: refCheckForceStopAlgorithms?.current?.input?.checked || false,
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

  const onWizardSubmit = ({ formData }) => {
    const method = isEdit ? 'put' : 'post';
    const url = 'store/algorithms';

    // const method = 'post';
    // const url = 'store/algorithms/apply';

    setIsSubmitLoading(true);
    client[method](url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        setIsSubmitLoading(false);
        if (isEdit) {
          if (res?.data?.buildId) {
            onOverviewAlgorithm(OVERVIEW_TABS.BUILDS);
          } else {
            applyAlgorithmVersion(res.data);
          }
        } else {
          onAfterSaveAlgorithm(res.data);
        }
      })
      .catch(error => {
        setIsSubmitLoading(false);
        message.error(
          error?.response?.data?.error?.message || 'Something is wrong!'
        );
      });
  };

  useEffect(() => {
    if (isEdit) {
      switchToForm();
    }
  }, []);
  // #endregion

  return editorIsVisible ? (
    <AlgorithmJsonEditor
      isEdit={isEdit}
      editorJsonValue={editorJsonValue}
      setEditorJsonValue={setEditorJsonValue}
      onWizardSubmit={onWizardSubmit}
      toggleEditor={switchToForm}
      setIsCheckForceStopAlgorithms={setIsCheckForceStopAlgorithms}
      refCheckForceStopAlgorithms={refCheckForceStopAlgorithms}
      isCheckForceStopAlgorithms={isCheckForceStopAlgorithms}
      sourceJson={algorithmValue || DEFAULT_EDITOR_VALUE}
      fileList={fileList}
      setFileList={setFileList}
    />
  ) : (
    <AddAlgorithmForm
      onToggle={switchToJson}
      onSubmit={onWizardSubmit}
      isEdit={isEdit}
      keyValueFormObject={keyValueFormObject}
      setIsSubmitLoading={setIsSubmitLoading}
      onOverviewAlgorithm={onOverviewAlgorithm}
      applyAlgorithmVersion={applyAlgorithmVersion}
      isCheckForceStopAlgorithms={isCheckForceStopAlgorithms}
      isSubmitLoading={isSubmitLoading}
      setIsCheckForceStopAlgorithms={setIsCheckForceStopAlgorithms}
      onAfterSaveAlgorithm={onAfterSaveAlgorithm}
      refCheckForceStopAlgorithms={refCheckForceStopAlgorithms}
      fileList={fileList}
      setFileList={setFileList}
    />
  );
};

AddAlgorithm.propTypes = {
  // eslint-disable-next-line
  onSubmit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  algorithmValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default memo(AddAlgorithm);
