import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import tryParse from 'utils/handleParsing';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightPanel,
} from 'components/Drawer';
import { Card, JsonEditor } from 'components/common';
import { Checkbox } from 'antd';
import _ from 'lodash';
import { mapObjValues, notification, stringify } from 'utils';
import schema from './schema';
import AlgorithmUploadFile from './AlgorithmUploadFile';

const isEmpty = v =>
  v === undefined ||
  v === `` ||
  v === null ||
  (typeof v === `object` && !Object.entries(v).length);
const isNotEmpty = ({ value }) => !isEmpty(value);
const { BUILD_TYPES } = schema;
const AlgorithmJsonEditor = ({
  isEdit,
  editorValue,
  setEditorValue,
  onWizardSubmit,
  toggleEditor,
  setIsCheckForceStopAlgorithms,
  refCheckForceStopAlgorithms,
  isCheckForceStopAlgorithms,
  sourceJson,
  fileList,
  setFileList,
}) => {
  const isCodeInJson = () =>
    editorValue.indexOf(`"${BUILD_TYPES.CODE.field}"`) !== -1;

  const [isCodeProp, setIsCodeProp] = useState(isCodeInJson());

  const onBeforeEditorSubmit = ({ src }) => {
    const srcJson = JSON.parse(src);
    const buildTypeSubmit = srcJson.code
      ? BUILD_TYPES.CODE.field
      : srcJson.image
      ? BUILD_TYPES.IMAGE.field
      : BUILD_TYPES.GIT.field;
    const formData = new FormData();

    if (buildTypeSubmit === BUILD_TYPES.CODE.field) {
      const [file] = fileList;

      if (!fileList.length && !isEdit) {
        notification({
          message: `Error`,
          description: `Please provide a file!`,
        });
        return;
      }

      formData.append(`file`, file);
    }

    // Reduce selected options to boolean entry
    const options = Object.values(srcJson.options).reduce(
      (acc, option) => ({ ...acc, [option]: true }),
      {}
    );

    // #region From Form-Object to Schema
    // On GIT build type:
    // [ env, entryPoint, baseImage ] are on the top object's keys level
    const { env, entryPoint, baseImage, ...rest } = srcJson[buildTypeSubmit];

    /* eslint-disable indent */

    const payload =
      buildTypeSubmit === BUILD_TYPES.GIT.field
        ? {
            ...srcJson,
            options,
            [BUILD_TYPES.GIT.field]: rest,
            env,
            entryPoint,
            baseImage,
          }
        : {
            ...srcJson,
            options,
            ...srcJson[buildTypeSubmit],
          };
    // #endregion

    if (buildTypeSubmit === BUILD_TYPES.GIT.field) {
      const commitObject = _.get(payload, BUILD_TYPES.GIT.COMMIT.field);
      if (commitObject.id === '') {
        delete payload.gitRepository.commit;
      }
    }

    const payloadFiltered = mapObjValues({
      obj: payload,
      predicate: isNotEmpty,
    });

    formData.append(`payload`, stringify(payloadFiltered));
    onWizardSubmit({ formData });
  };

  const onEditorSubmit = () => {
    tryParse({ src: editorValue, onSuccess: onBeforeEditorSubmit });
  };

  const resetJson = () => {
    const oJson = JSON.parse(sourceJson);

    delete oJson.entryPoint;
    delete oJson.env;
    delete oJson.baseImage;

    setEditorValue(stringify(oJson));
  };

  useEffect(() => {
    setIsCodeProp(isCodeInJson());
  }, [editorValue]);

  return (
    <>
      <Card style={{ flex: 1 }} bodyStyle={{ height: '100%' }}>
        <JsonEditor value={editorValue} onChange={setEditorValue} />
      </Card>
      {isCodeProp && (
        <Card>
          <AlgorithmUploadFile
            fileList={fileList}
            setFileList={setFileList}
            isEdit={isEdit}
          />
        </Card>
      )}
      <BottomPanel>
        <PanelButton
          key="editor"
          onClick={() => toggleEditor(editorValue, 'form')}>
          Back to form
        </PanelButton>
        <PanelButton key="editor" onClick={() => resetJson()}>
          Original Json
        </PanelButton>
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
            key="Submit"
            type="primary"
            onClick={onEditorSubmit}>
            Submit
          </RightAlignedButton>
        </RightPanel>
      </BottomPanel>
    </>
  );
};

AlgorithmJsonEditor.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  editorValue: PropTypes.instanceOf(PropTypes.object).isRequired,
  onWizardSubmit: PropTypes.func.isRequired,
  toggleEditor: PropTypes.bool.isRequired,
  setIsCheckForceStopAlgorithms: PropTypes.func.isRequired,
  refCheckForceStopAlgorithms: PropTypes.func.isRequired,
  setEditorValue: PropTypes.func.isRequired,
  isCheckForceStopAlgorithms: PropTypes.bool.isRequired,
  sourceJson: PropTypes.instanceOf(PropTypes.object).isRequired,
  fileList: PropTypes.oneOfType([PropTypes.object]).isRequired,
  setFileList: PropTypes.func.isRequired,
};

export default AlgorithmJsonEditor;
