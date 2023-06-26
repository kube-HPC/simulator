import React, { memo, useState, useCallback, useRef } from 'react';
import client from 'client';
import { errorsCode } from '@hkube/consts';
import PropTypes from 'prop-types';
import { Checkbox, Modal, message } from 'antd';
import Text from 'antd/lib/typography/Text';
import { addAlgorithmTemplate } from 'config';
import { stringify, mergeObjects, tryParseJson } from 'utils';
import { OVERVIEW_TABS } from 'const';
import usePath from './../../Tables/Algorithms/usePath';
import AddAlgorithmForm from './AddAlgorithmForm.react';
import AlgorithmJsonEditor from './AlgorithmJsonEditor';

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);
const AddAlgorithm = ({ algorithmValue }) => {
  // #region  Editor State
  const refCheckForceStopAlgorithms = useRef(false);
  const [editorIsVisible, setEditorIsVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(algorithmValue !== undefined);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCheckForceStopAlgorithms, setIsCheckForceStopAlgorithms] = useState(
    !isEdit
  );
  const [keyValueObject, setKeyValueObject] = useState(
    (algorithmValue && JSON.parse(algorithmValue)) || undefined
  );
  const [editorValue, setEditorValue] = useState(
    algorithmValue || DEFAULT_EDITOR_VALUE
  );
  const toggleEditor = () => setEditorIsVisible(prev => !prev);
  const [fileList, setFileList] = useState([]);

  const switchToJson = (objForm, type) => {
    const objDeepCopy = tryParseJson(editorValue);
    const arrayPropType = ['gitRepository', 'code', 'image'];

    // remove not need props
    arrayPropType.forEach(element => {
      if (element !== type) {
        delete objDeepCopy[element];
      }
    });

    const newEditorValue = mergeObjects(
      { ...objForm.main, [type]: objForm[type] },
      objDeepCopy
    );

    setEditorValue(stringify(newEditorValue));

    toggleEditor();
  };

  const switchToForm = () => {
    const objJsonData = JSON.parse(editorValue);

    if (objJsonData.gitRepository) {
      const { gitRepository } = objJsonData;
      delete objJsonData.gitRepository;
      // objJsonData.type="git"
      // form.setFieldsValue({main: obj, gitRepository})
      setKeyValueObject({ main: objJsonData, gitRepository });
      toggleEditor(prev => !prev);
    }

    if (objJsonData.code) {
      const { code } = objJsonData;
      delete objJsonData.code;
      objJsonData.type = 'code';
      // form.setFieldsValue({main: obj, gitRepository})
      setKeyValueObject({ main: objJsonData, code });
      toggleEditor(prev => !prev);
    }

    if (objJsonData.image) {
      const { image } = objJsonData;
      delete objJsonData.image;
      objJsonData.type = 'image';

      // form.setFieldsValue({main: obj, gitRepository})
      setKeyValueObject({ main: objJsonData, image });
      toggleEditor(prev => !prev);
    }
  };

  const { goTo } = usePath();

  const onOverviewAlgorithm = useCallback(
    (tab, name) => {
      if (keyValueObject || name) {
        goTo.overview({
          nextAlgorithmId: keyValueObject?.name || name,
          nextTabKey: tab || OVERVIEW_TABS.VERSIONS,
        });
      }
    },
    [goTo, keyValueObject]
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

  const onWizardSubmit = ({ formData }) => {
    setIsSubmitLoading(true);
    client
      .post('store/algorithms/apply', formData, {
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
          error.response.data.error.message || 'Something is wrong!'
        );
      });
  };

  // #endregion

  return editorIsVisible ? (
    <AlgorithmJsonEditor
      isEdit={isEdit}
      editorValue={editorValue}
      setEditorValue={setEditorValue}
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
      keyValueObject={keyValueObject}
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
AddAlgorithm.defaultProps = {
  algorithmValue: undefined,
};
export default memo(AddAlgorithm);
