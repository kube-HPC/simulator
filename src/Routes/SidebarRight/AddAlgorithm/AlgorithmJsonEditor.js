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
  editorJsonValue,
  setEditorJsonValue,
  onWizardSubmit,
  toggleEditor,
  setIsCheckForceStopAlgorithms,
  refCheckForceStopAlgorithms,
  isCheckForceStopAlgorithms,
  sourceJson,
  fileList,
  setFileList,
}) => {
  const isCodeInJson = () => editorJsonValue.indexOf('"Code"') > -1 || false;
  const [isCodeProp, setIsCodeProp] = useState(false);

  const onBeforeEditorSubmit = ({ src }) => {
    // JSON submit
    const srcJson = JSON.parse(src);
    const buildTypeSubmit = srcJson.type;

    const formData = new FormData();

    if (buildTypeSubmit.toLowerCase() === BUILD_TYPES.CODE.field) {
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

    const payload = srcJson;
    delete payload.type;

    if (buildTypeSubmit === BUILD_TYPES.GIT.label) {
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
    tryParse({ src: editorJsonValue, onSuccess: onBeforeEditorSubmit });
  };

  const resetJson = () => {
    setEditorJsonValue(sourceJson);
  };

  useEffect(() => {
    setIsCodeProp(isCodeInJson());
  }, [editorJsonValue]);

  return (
    <>
      <Card style={{ flex: 1 }} bodyStyle={{ height: '100%' }}>
        <JsonEditor value={editorJsonValue} onChange={setEditorJsonValue} />
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
        <PanelButton key="editor" onClick={toggleEditor}>
          Back to form
        </PanelButton>
        {isEdit && (
          <PanelButton key="editor" onClick={() => resetJson()}>
            Original Json
          </PanelButton>
        )}
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
  editorJsonValue: PropTypes.instanceOf(PropTypes.object).isRequired,
  onWizardSubmit: PropTypes.func.isRequired,
  toggleEditor: PropTypes.bool.isRequired,
  setIsCheckForceStopAlgorithms: PropTypes.func.isRequired,
  refCheckForceStopAlgorithms: PropTypes.func.isRequired,
  setEditorJsonValue: PropTypes.func.isRequired,
  isCheckForceStopAlgorithms: PropTypes.bool.isRequired,
  sourceJson: PropTypes.instanceOf(PropTypes.object).isRequired,
  fileList: PropTypes.oneOfType([PropTypes.object]).isRequired,
  setFileList: PropTypes.func.isRequired,
};

export default AlgorithmJsonEditor;
