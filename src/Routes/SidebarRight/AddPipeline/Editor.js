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
  PanelButtonWizard,
} from 'components/Drawer';
import { Row, Col } from 'antd';

const JsonViewWrapper = styled.div`
  border: 1px solid ${COLOR_LAYOUT.border};
  border-bottom: none;
  flex: 1;
  height: 80vh;
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
  isEdit,
}) => {
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

  const onEditorSubmit = () =>
    tryParse({
      src: innerState,
      onSuccess: ({ parsed }) => {
        onSubmit(parsed);
      },
    });

  const onDefault = () => setInnerState(intervalEditorValue);

  useEffect(
    () => setValuesItemsState(false),
    [innerState, setEditorState, setValuesItemsState]
  );

  return (
    <>
      <Row justify="center" align="top">
        <Col span={22}>
          <JsonViewWrapper>
            <JsonEditor
              value={innerState}
              onChange={setInnerState}
              height="100%"
              width="100%"
            />
          </JsonViewWrapper>
        </Col>
        <Col span={2}>
          <PanelButtonWizard
            key="Editor"
            onClick={() => setValuesItemsState(true)}>
            Back to wizard
          </PanelButtonWizard>
        </Col>
      </Row>

      <BottomPanel width={DRAWER_SIZE.ADD_PIPELINE}>
        {/* <PanelButton key="Editor" onClick={handleToggle}> */}

        {!isRunPipeline && (
          <PanelButton
            type="dashed"
            onClick={onDefault}
            style={{ margin: '0 1ch' }}>
            Reset
          </PanelButton>
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
  isEdit: PropTypes.bool.isRequired,
};

export default Editor;
