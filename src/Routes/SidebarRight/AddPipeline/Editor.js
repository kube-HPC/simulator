import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CheckOutlined } from '@ant-design/icons';
import { COLOR_LAYOUT } from 'styles';
import { DRAWER_SIZE } from 'const';
import { JsonEditor } from 'components/common';
import { tryParse, stringify } from 'utils';
import { addPipelineTemplate } from 'config';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
} from 'components/Drawer';

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);

const JsonViewWrapper = styled.div`
  border: 1px solid ${COLOR_LAYOUT.border};
  border-bottom: none;
  flex: 1;
`;

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
}) => {
  const nodes = useMemo(() => initialState?.nodes, []);

  const [innerState, setInnerState] = useState(() =>
    JSON.stringify(
      isRunPipeline ? removeNodesPipeline(initialState) : initialState,
      null,
      4
    )
  );

  const setValuesState = useCallback(
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
    [innerState, setEditorState, toggle]
  );

  const onEditorSubmit = () =>
    tryParse({
      src: innerState,
      onSuccess: ({ parsed }) => {
        onSubmit(parsed);
      },
    });

  const onDefault = () => setInnerState(INITIAL_EDITOR_VALUE);
  const onClear = () => setInnerState('');

  useEffect(() => setValuesState(false), [
    innerState,
    setEditorState,
    setValuesState,
  ]);

  return (
    <>
      <JsonViewWrapper>
        <JsonEditor
          value={innerState}
          onChange={setInnerState}
          height="100%"
          width="100%"
        />
      </JsonViewWrapper>

      <BottomPanel width={DRAWER_SIZE.ADD_PIPELINE}>
        {/* <PanelButton key="Editor" onClick={handleToggle}> */}
        <PanelButton key="Editor" onClick={() => setValuesState(true)}>
          Wizard View
        </PanelButton>
        {!isRunPipeline && (
          <>
            <PanelButton
              type="dashed"
              onClick={onDefault}
              style={{ margin: '0 1ch' }}>
              Default
            </PanelButton>
            <PanelButton type="danger" onClick={onClear}>
              Clear
            </PanelButton>
          </>
        )}
        <RightAlignedButton
          type="primary"
          onClick={onEditorSubmit}
          form="add-pipeline"
          htmlType="submit">
          {isRunPipeline ? 'Run' : 'Submit'}
          <CheckOutlined />
        </RightAlignedButton>
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
};

export default Editor;
