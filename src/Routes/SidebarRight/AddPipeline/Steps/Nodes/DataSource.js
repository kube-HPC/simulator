import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import useDataSources from 'hooks/useDataSources';
import useWizardContext from '../../useWizardContext';
import { Field as RawField } from './../FormUtils';

const ctx = React.createContext();

/** @type {import('./../FormUtils').FieldProps} */
const Field = props => {
  const { form } = useWizardContext();
  const { rootId } = useContext(ctx);
  return (
    <RawField
      {...props}
      getFieldDecorator={form.getFieldDecorator}
      rootId={rootId}
    />
  );
};
// eslint-disable-next-line
const DataSourceNode = ({ id }) => {
  const { dataSources: collection } = useDataSources();
  console.log(collection);
  const names = collection.map(item => item.name);
  console.log({ names });
  return (
    <ctx.Provider value={{ rootId: `nodes.${id}.datasource` }}>
      <Field name="name" title="DataSource Name">
        <Input placeholder="DataSource Name" />
      </Field>
      <Field name="id" title="Id">
        <Input placeholder="Version Id" />
      </Field>
      <Field name="snapshot.name" title="Snapshot Name">
        <Input placeholder="Snapshot Name" />
      </Field>
    </ctx.Provider>
  );
};

DataSourceNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default DataSourceNode;
