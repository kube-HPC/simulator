import React, { memo, useState, useCallback, useRef } from 'react';
import client from 'client';
import PropTypes from 'prop-types';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightPanel,
} from 'components/Drawer';
import { Checkbox, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Card, JsonEditor } from 'components/common';
import { addAlgorithmTemplate } from 'config';
import { useActions } from 'hooks';
import { stringify, notification } from 'utils';
import tryParse from 'utils/handleParsing';
import { OVERVIEW_TABS } from 'const';
import usePath from './../../Tables/Algorithms/usePath';
import AddAlgorithmForm from './AddAlgorithmForm.react';

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);
const noop = () => {};

const AddAlgorithm = ({ onSubmit = noop, algorithmValue }) => {
  // #region  Editor State
  const refCheckForceStopAlgorithms = useRef(false);
  const [editorIsVisible, setEditorIsVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(algorithmValue !== undefined);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCheckForceStopAlgorithms, setIsCheckForceStopAlgorithms] = useState(
    !isEdit
  );

  const [editorValue, setEditorValue] = useState(
    algorithmValue || DEFAULT_EDITOR_VALUE
  );

  const toggleEditor = () => setEditorIsVisible(prev => !prev);

  const onClear = () => setEditorValue(``);
  const onDefault = () => setEditorValue(DEFAULT_EDITOR_VALUE);

  const { applyAlgorithm } = useActions();
  const { goTo } = usePath();

  const keyValueObject =
    (algorithmValue && JSON.parse(algorithmValue)) || undefined;
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
      if (dataResponse.messages) {
        notification({ message: dataResponse.messages });
      }

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
  const onSuccess = ({ src }) => {
    const formData = new FormData();
    formData.append(`payload`, src);
    onSubmit({ payload: src });

    if (isEdit) {
      applyAlgorithm(formData, res => {
        if (res.buildId) {
          onOverviewAlgorithm(OVERVIEW_TABS.BUILDS);
        } else {
          applyAlgorithmVersion(res);
        }
      });
    } else {
      applyAlgorithm(formData, res => onAfterSaveAlgorithm(res));
    }
  };

  const onEditorSubmit = () => tryParse({ src: editorValue, onSuccess });
  // #endregion

  return editorIsVisible ? (
    <>
      <Card style={{ flex: 1 }} bodyStyle={{ height: '100%' }}>
        <JsonEditor value={editorValue} onChange={setEditorValue} />
      </Card>
      <BottomPanel>
        <PanelButton key="editor" onClick={toggleEditor}>
          Form View
        </PanelButton>
        <PanelButton key="default" type="dashed" onClick={onDefault}>
          Default
        </PanelButton>
        <PanelButton key="clear" type="danger" onClick={onClear}>
          Clear
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
  ) : (
    <AddAlgorithmForm
      onToggle={toggleEditor}
      onSubmit={onSubmit}
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
    />
  );
};

AddAlgorithm.propTypes = {
  // eslint-disable-next-line
  onSubmit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  algorithmValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
};

export default memo(AddAlgorithm);
