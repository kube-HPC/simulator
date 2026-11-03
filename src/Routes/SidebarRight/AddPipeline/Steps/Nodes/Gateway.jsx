import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber } from 'antd';

import useWizardContext from '../../useWizardContext';
import { Field as RawField } from '../FormUtils';

import MemoryField from '../../../AddAlgorithm/MemoryField.react';
import { memoryTypes } from '../../../AddAlgorithm/schema';

const ctx = React.createContext();

/** @type {import('../FormUtils').FieldProps} */
const Field = props => {
  const { form } = useWizardContext();
  const { rootId } = useContext(ctx);
  return (
    <RawField {...props} getFieldValue={form.getFieldValue} rootId={rootId} />
  );
};

const GatewayNode = ({ id }) => {
  const { initialState } = useWizardContext();

  const providerValue = useMemo(
    () => ({ rootId: ['nodes', id, 'spec'] }),
    [id]
  );

  return (
    <ctx.Provider value={providerValue}>
      <Field name={['name']} title="Name">
        <Input
          placeholder="Name Gateway"
          data-testid={`add-pipeline-nodes-${id}-gateway-name-input`}
        />
      </Field>

      <Field name={['description']} title="Description" skipValidation>
        <Input
          placeholder="Description"
          data-testid={`add-pipeline-nodes-${id}-gateway-description-input`}
        />
      </Field>
      <Field
        name={['mem']}
        title="Mem"
        initialValue={
          initialState?.nodes[id]?.spec?.mem
            ? initialState?.nodes[id]?.spec?.mem
            : '512Mi'
        }>
        <MemoryField
          testId={`add-pipeline-nodes-${id}-gateway-mem`}
          options={memoryTypes.map(value => ({
            value,
            label: value,
          }))}
        />
      </Field>
      <Field name={['cpu']} title="Cpu" initialValue={0.5} skipValidation>
        <InputNumber
          min={0}
          data-testid={`add-pipeline-nodes-${id}-gateway-cpu-input`}
        />
      </Field>
    </ctx.Provider>
  );
};
GatewayNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default GatewayNode;
