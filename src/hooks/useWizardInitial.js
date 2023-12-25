import React, { useCallback, useState } from 'react';
import { Modal, Typography } from 'antd';

const cleanNodes = nodes => {
  // Iterate over each node
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // Iterate over the input array of the current node
    for (let j = 0; j < node.input.length; j++) {
      const inputItem = node.input[j];

      // Remove items starting with '#' or '@'
      if (
        typeof inputItem === 'string' &&
        (inputItem.startsWith('#') || inputItem.startsWith('@'))
      ) {
        node.input.splice(j, 1);
        j--; // Adjust the index as the array length has decreased
      }
    }
  }

  return nodes;
};

const useWizardInitial = (valuesState, form, setForm) => {
  const [kindOverSelect, setKindOverSelect] = useState('stream');

  const [nodeNames] = useState(
    valuesState?.nodes?.map(item => item?.nodeName) || []
  );

  const [isSelectStreaming, setIsSelectStreaming] = useState(
    valuesState.kind === 'stream'
  );

  const hasSpecialInput = useCallback(
    nodes =>
      nodes.some(
        node =>
          node.input &&
          node.input.some(
            entry => entry && (entry.startsWith('#') || entry.startsWith('@'))
          )
      ),
    []
  );

  const nodesToStringLastAnd = useCallback(nodes => {
    if (!Array.isArray(nodes)) {
      throw new Error('Input must be an array of nodes');
    }

    const { length } = nodes;
    if (length === 0) {
      return '';
    }
    if (length === 1) {
      return nodes[0].name;
    }
    const partNodeNames = nodes.slice(0, length - 1).map(node => node.nodeName);
    const lastNodeName = nodes[length - 1].nodeName;

    const resultString = `${partNodeNames.join(',')} and ${lastNodeName}`;

    return resultString;
  }, []);

  const checkNodesToMsg = useCallback(
    nodes => {
      const nonAlgorithmNodes = nodes.filter(node => node.kind !== 'algorithm');

      if (nonAlgorithmNodes.length > 0) {
        const kinds = nonAlgorithmNodes.map(node => node.kind).join(', ');
        const nodeNamesMsg = nodesToStringLastAnd(nonAlgorithmNodes);

        return `2. There is no use of <b>${kinds}</b> in streaming, node${
          nonAlgorithmNodes.length > 1 ? 's' : ''
        } ${nodeNamesMsg} will be removed.`;
      }

      return '';
    },
    [nodesToStringLastAnd]
  );

  const hasNonNullStateType = useCallback(nodes => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.stateType !== null && node.stateType !== undefined) {
        return true;
      }
    }
    return false;
  }, []);

  const msgByKind = useCallback(
    kindValue => {
      const schemaObjectForm = form.getFieldsValue();

      if (kindValue === 'stream') {
        const msgStream1 = hasSpecialInput(schemaObjectForm.nodes);
        const msgStream2 = checkNodesToMsg(schemaObjectForm.nodes);
        return (
          <Typography.Text>
            {msgStream1 && (
              <p>
                1. By converting the pipeline to Streaming, you will lose some
                of the input parameters you defined.
              </p>
            )}
            {msgStream2 && <p>{msgStream2}</p>}

            <p>Do you wish to proceed?</p>
          </Typography.Text>
        );
      }

      const msgbatch1 =
        (schemaObjectForm?.streaming?.flows &&
          Object.keys(schemaObjectForm?.streaming?.flows).length > 0) ||
        false;

      const msgbatch2 = hasNonNullStateType(schemaObjectForm.nodes);

      return (
        <Typography.Text>
          {msgbatch1 && (
            <p>
              1. By converting the pipeline to batch, you will lose the
              streaming flows you defined.
            </p>
          )}
          {msgbatch2 && (
            <p>
              2. You set some of the nodes to stateless or stateful, there is no
              meaning for that in a batch pipeline. You will lose any
              information related to these kinds.
            </p>
          )}
          <p>Do you wish to proceed?</p>
        </Typography.Text>
      );
    },
    [form, hasNonNullStateType, hasSpecialInput, checkNodesToMsg]
  );

  const handleRadioClick = useCallback(
    (e, value) => {
      if (valuesState.kind !== value) {
        Modal.confirm({
          title: 'Warning',
          content: msgByKind(value, form),
          onOk: () => {
            form.setFieldsValue({ kind: value });

            const formFields = form.getFieldsValue(true);

            if (value === 'stream') {
              const algorithmNodes = formFields.nodes.filter(
                x => x.kind === 'algorithm'
              );

              const cleanItemInputAlgorithmNodes = cleanNodes(algorithmNodes);

              form.setFieldValue('nodes', cleanItemInputAlgorithmNodes);
            }

            setIsSelectStreaming(value === 'stream');
            setForm();
          },
          onCancel: () => {},
        });
      }
    },
    [form, msgByKind, setForm, valuesState.kind]
  );

  return {
    nodeNames,
    isSelectStreaming,
    kindOverSelect,
    setKindOverSelect,
    handleRadioClick,
  };
};

export default useWizardInitial;
