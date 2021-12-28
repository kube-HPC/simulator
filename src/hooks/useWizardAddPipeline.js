import { useEffect, useCallback, useState, useReducer } from 'react';
import { WIZARD_STATE } from 'const';
import { addPipelineTemplate } from 'config';
import cleanDeep from 'clean-deep';
import { usePipeline } from 'hooks';
import { Form } from 'antd';
import packageJson from './../../package.json';

/** @param {import('./fields').DataSourceNode} node */
const formatDataSourceNode = node =>
  // if used datasource by id, avoid all other parameters
  node?.dataSource?.id
    ? {
        ...node,
        dataSource: {
          id: node?.dataSource?.id,
        },
      }
    : node;

/** @param {import('./fields').AlgorithmNode} node */
const formatAlgorithmNode = node => {
  const { kind, ...rest } = node;
  return rest;
};

const formats = {
  dataSource: formatDataSourceNode,
  algorithm: formatAlgorithmNode,
};

/** @param {import('./fields').Node} node */
const formatNode = node => {
  const formatter = formats[node.kind];
  return formatter ? formatter(node) : node;
};

const LOCAL_STORAGE_KEY = 'add-pipeline-form-state';

const useWizardAddPipeline = jsonPipeline => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState(WIZARD_STATE.IDLE);
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [wizardStepIdx, setWizardStepIdx] = useState(0);
  const [isEdit] = useState(jsonPipeline !== undefined);
  const { addPipeline, updatePipeline } = usePipeline();

  useEffect(() => {
    // avoid infinite looping

    if (status === WIZARD_STATE.IDLE) {
      if (isEdit) {
        const jsonEdit = JSON.parse(jsonPipeline);
        if (jsonEdit.nodes) {
          jsonEdit.nodes.forEach(item => {
            if (item.kind === undefined) {
              // eslint-disable-next-line no-param-reassign
              item.kind = 'algorithm';
            }
          });
        }

        setEditorState(jsonEdit);
      } else {
        const rawData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
          const parsedState = JSON.parse(rawData);
          if (parsedState?.stateVersion !== packageJson.version) {
            window.localStorage.removeItem(LOCAL_STORAGE_KEY);
          } else if (parsedState) {
            setEditorState(parsedState);
          }
        } catch (error) {
          console.info('did not load form state from storage');
        }
      }

      setStatus(WIZARD_STATE.READY);
    }

    if (status === WIZARD_STATE.CLEAR) {
      form.resetFields();
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      setEditorState(addPipelineTemplate);
      setWizardStepIdx(0);
      setStatus(WIZARD_STATE.IDLE);
    }

    return () => {
      // avoid infinite looping
      if (status !== WIZARD_STATE.READY) return;

      if (!isEdit) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ ...editorState, stateVersion: packageJson.version })
        );
      } else window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    };
  }, [
    setEditorState,
    editorState,
    status,
    setStatus,
    form,
    jsonPipeline,
    isEdit,
  ]);

  const handleSubmit = useCallback(
    formData => {
      /** @type {import('./fields').PipelineDescriptor} */
      const formattedData = {
        ...formData,
        nodes: formData.nodes.map(formatNode),
      };

      if (isEdit) {
        updatePipeline(cleanDeep(formattedData), LOCAL_STORAGE_KEY);
      } else {
        addPipeline(cleanDeep(formattedData), LOCAL_STORAGE_KEY);
      }

      // prevent re-saving to localStorage
      setStatus(WIZARD_STATE.SUBMITTED);
    },
    [addPipeline, updatePipeline, isEdit]
  );

  const wizardClear = useCallback(() => {
    setStatus(WIZARD_STATE.CLEAR);
  }, [setStatus]);

  return {
    form,
    isEdit,
    isEditorVisible,
    setWizardStepIdx,
    wizardStepIdx,
    wizardClear,
    toggle,
    handleSubmit,
    editorState,
    setEditorState,
    status,
  };
};

export default useWizardAddPipeline;
