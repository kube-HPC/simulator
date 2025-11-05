import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined } from '@ant-design/icons';
import { Card, JsonEditor } from 'components/common';
import { tryParse, stringify } from 'utils';
import { addPipelineTemplate } from 'config';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightPanel,
} from 'components/Drawer';

const removeNodesPipeline = InitialState => {
  const obj = { ...InitialState };
  delete obj.nodes;
  return obj;
};

const addNodesPipeline = (currentPipeline, nodes) => {
  const obj = { ...currentPipeline };
  obj.nodes = nodes;
  return obj;
};

const Editor = ({
  toggle,
  onSubmit,
  initialState,
  setEditorState,
  isRunPipeline,
  isEdit,
}) => {
  const submitButtonRef = useRef(null);

  const intervalEditorValue = useMemo(
    () => (isEdit ? stringify(initialState) : stringify(addPipelineTemplate)),
    []
  );

  const nodes = useMemo(() => initialState?.nodes, []);

  const [innerState, setInnerState] = useState(() =>
    JSON.stringify(
      isRunPipeline ? removeNodesPipeline(initialState) : initialState,
      null,
      4
    )
  );

  const setValuesItemsState = useCallback(
    isToggle => {
      tryParse({
        src: innerState,
        onSuccess: ({ parsed }) => {
          if (isToggle && isRunPipeline) {
            setEditorState(addNodesPipeline(parsed, nodes));
          } else {
            setEditorState(parsed);
          }

          if (isToggle) toggle();
        },
        onFail: () => {},
      });
    },
    [innerState, isRunPipeline, nodes, setEditorState, toggle]
  );

  const onEditorSubmit = useCallback(
    () =>
      tryParse({
        src: innerState,
        onSuccess: ({ parsed }) => {
          onSubmit(parsed);
        },
      }),
    [innerState, onSubmit]
  );

  const handleSave = useCallback(() => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  }, []);

  const onDefault = () => setInnerState(intervalEditorValue);

  useEffect(
    () => setValuesItemsState(false),
    [innerState, setEditorState, setValuesItemsState]
  );

  return (
    <>
      <Card style={{ flex: 1 }} styles={{ body: { height: '100%' } }}>
        <JsonEditor
          value={innerState}
          onChange={setInnerState}
          onSave={handleSave}
        />
      </Card>
      <BottomPanel style={{ marginBottom: 0 }}>
        <PanelButton
          key="back-to-wizard"
          onClick={() => setValuesItemsState(true)}>
          Back to wizard
        </PanelButton>
        {!isRunPipeline && (
          <PanelButton key="reset" onClick={onDefault}>
            Reset
          </PanelButton>
        )}
        <RightPanel>
          <RightAlignedButton
            ref={submitButtonRef}
            key="Submit"
            type="primary"
            onClick={onEditorSubmit}
            form="add-pipeline"
            htmlType="submit">
            {isRunPipeline ? 'Run' : 'Submit'}
            <CheckOutlined />
          </RightAlignedButton>
        </RightPanel>
      </BottomPanel>
    </>
  );
};

Editor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  // eslint-disable-next-line
  initialState: PropTypes.object.isRequired,
  isRunPipeline: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default Editor;
