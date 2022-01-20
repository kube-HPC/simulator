import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, InputNumber } from 'antd';

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
  return (
    <ctx.Provider value={{ rootId: ['nodes', id, 'spec'] }}>
      <Field name={['name']} title="Name">
        <Input placeholder="Name Gateway" />
      </Field>

      <Field name={['description']} title="Description" skipValidation>
        <Input placeholder="Description" />
      </Field>
      <Field
        name={['mem']}
        title="Mem"
        initialValue={
          initialState?.nodes[id]?.spec?.mem
            ? initialState?.nodes[id]?.spec?.mem
            : '512Mi'
        }>
        <MemoryField>
          {memoryTypes.map(value => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </MemoryField>
      </Field>
      <Field name={['cpu']} title="Cpu" skipValidation>
        <InputNumber min={0} defaultValue={0.5} />
      </Field>
    </ctx.Provider>
  );
};
GatewayNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default GatewayNode;
