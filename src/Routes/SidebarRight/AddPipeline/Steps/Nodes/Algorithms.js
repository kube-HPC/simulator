import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Switch, Radio, AutoComplete } from 'antd';
import { Form as CommonForm } from 'components/common';
import { useGetLists } from 'hooks/graphql';
import InputNumberSwitch from './inputNumberSwitch';
import Controller from './InputParseJson';
import useWizardContext from '../../useWizardContext';
import { Field as RawField } from './../FormUtils';

const { Divider, Collapsible } = CommonForm;

const ctx = createContext();

/** @type {import('./../FormUtils').FieldProps} */
const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const AlgorithmNode = ({ id }) => {
  const { isStreamingPipeline, valuesState } = useWizardContext();
  const { algorithms: sortedAlgorithms } = useGetLists();
  const rootId = useMemo(() => ['nodes', id], [id]);

  const contextValue = useMemo(() => ({ rootId }), [rootId]);

  return (
    <ctx.Provider value={contextValue}>
      <Field name={['algorithmName']} title="Algorithm">
        <AutoComplete
          disabled={sortedAlgorithms?.length === 0}
          options={sortedAlgorithms}
          filterOption={(inputValue, option) =>
            option.value.indexOf(inputValue) !== -1
          }
        />
      </Field>
      {isStreamingPipeline &&
        valuesState?.nodes[id]?.stateType === 'stateless' && (
          <Collapsible
            title="Stateless Counts"
            defaultExpanded={
              valuesState?.nodes[id].minStatelessCount > 0 ||
              valuesState?.nodes[id].maxStatelessCount > 0
            }>
            <Field
              inline={false}
              title="Min"
              name={['minStatelessCount']}
              initialValue={0}
              skipValidation>
              <InputNumber min={0} />
            </Field>
            <Field
              inline={false}
              title="Max"
              name={['maxStatelessCount']}
              initialValue={null}
              skipValidation>
              <InputNumberSwitch />
            </Field>
          </Collapsible>
        )}

      <Divider>Inputs</Divider>

      <Controller
        node={valuesState?.nodes[id]}
        placeholder="Input"
        tooltip="Input"
        nodeIdx={id}
        isRequired={false}
      />
      <Collapsible title="Retry">
        <Field
          name={['retry', 'policy']}
          title="Policy"
          initialValue="OnCrash"
          skipValidation>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="Never">Never</Radio.Button>
            <Radio.Button value="Always">Always</Radio.Button>
            <Radio.Button value="OnError">OnError</Radio.Button>
            <Radio.Button value="OnCrash">OnCrash</Radio.Button>
          </Radio.Group>
        </Field>
        <Field
          inline={false}
          title="Retry Limit"
          name={['retry', 'limit']}
          initialValue={3}
          skipValidation>
          <InputNumber min={0} />
        </Field>
      </Collapsible>
      <Collapsible title="Options">
        {!isStreamingPipeline && (
          <Field
            name={['batchOperation']}
            title="Batch Operation"
            skipValidation
            initialValue="indexed">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="indexed">indexed</Radio.Button>
              <Radio.Button value="cartesian">cartesian</Radio.Button>
            </Radio.Group>
          </Field>
        )}
        <Field title="Node TTL" name={['ttl']} initialValue={0} skipValidation>
          <InputNumber min={0} />
        </Field>

        {!isStreamingPipeline && (
          <Field
            overrides={{ valuePropName: 'checked' }}
            title="Include In Pipeline Results"
            name={['includeInResult']}
            skipValidation>
            <Switch />
          </Field>
        )}

        {!isStreamingPipeline && (
          <Field
            overrides={{ valuePropName: 'checked' }}
            title="Create A Tensorboard"
            name={['metrics', 'tensorboard']}
            skipValidation>
            <Switch />
          </Field>
        )}
      </Collapsible>
    </ctx.Provider>
  );
};

AlgorithmNode.propTypes = {
  id: PropTypes.node.isRequired,
};

export default AlgorithmNode;
