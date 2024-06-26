import { useEffect, useCallback } from 'react';
import { WIZARD_STATE, LOCAL_STORAGE_KEYS } from 'const';

import cleanDeep from 'clean-deep';
/* eslint-disable import/no-cycle */
import { usePipeline } from 'hooks';

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

const useWizardAddPipeline = (
  jsonPipeline,
  status,
  isEdit,
  setEditorState,
  setStatus,
  form,
  setWizardStepIdx,
  editorState,
  addPipelineTemplate,
  isRunPipeline
) => {
  const { addPipeline, updatePipeline, runPipeline } = usePipeline();

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
        const rawData = window.localStorage.getItem(
          LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
        );
        try {
          const parsedState = JSON.parse(rawData);
          if (parsedState?.stateVersion !== packageJson.version) {
            window.localStorage.removeItem(
              LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
            );
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
      window.localStorage.removeItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
      );
      setEditorState(addPipelineTemplate);
      setWizardStepIdx(0);
      setStatus(WIZARD_STATE.IDLE);
    }

    return () => {
      // avoid infinite looping
      if (status !== WIZARD_STATE.READY) return;

      if (!isEdit) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE,
          JSON.stringify({ ...editorState, stateVersion: packageJson.version })
        );
      } else
        window.localStorage.removeItem(
          LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
        );
    };
  }, [
    setEditorState,
    editorState,
    status,
    setStatus,
    form,
    jsonPipeline,
    isEdit,
    setWizardStepIdx,
    addPipelineTemplate,
  ]);

  const handleSubmit = useCallback(
    formData => {
      /** @type {import('./fields').PipelineDescriptor} */

      let formattedData = null;

      if (formData.nodes) {
        formattedData = {
          ...formData,
          nodes: formData.nodes.map(formatNode),
        };
      } else {
        formattedData = formData;
      }

      if (isEdit) {
        if (isRunPipeline) {
          runPipeline(cleanDeep(formattedData, { emptyArrays: false }));
        } else {
          updatePipeline(
            cleanDeep(formattedData, { emptyArrays: false }),
            LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
          );
        }
      } else {
        addPipeline(
          cleanDeep(formattedData, { emptyArrays: false }),
          LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_ADD_PIPELINE
        );
      }

      // prevent re-saving to localStorage
      setStatus(WIZARD_STATE.SUBMITTED);
    },
    [isEdit, setStatus, isRunPipeline, runPipeline, updatePipeline, addPipeline]
  );

  return {
    handleSubmit,
  };
};

export default useWizardAddPipeline;
