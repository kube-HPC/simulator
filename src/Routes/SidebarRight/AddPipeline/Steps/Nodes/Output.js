import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Divider } from 'antd';
import Controller from './InputParseJson';
import useWizardContext from '../../useWizardContext';
import { Field as RawField } from '../FormUtils';

import MemoryField from '../../../AddAlgorithm/MemoryField.react';
import { memoryTypes } from '../../../AddAlgorithm/schema';

const ctx = React.createContext();

const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const OutputNode = ({ id }) => {
  const { initialState } = useWizardContext();
  const rootId = ['nodes', id, 'spec'];

  const contextValue = useMemo(() => ({ rootId }), [rootId]);

  return (
    <ctx.Provider value={contextValue}>
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
      <Divider>Inputs</Divider>
      <Controller placeholder="Input" tooltip="Input" nodeIdx={id} isRequired />
    </ctx.Provider>
  );
};

OutputNode.propTypes = {
  id: PropTypes.node.isRequired,
};

export default OutputNode;
