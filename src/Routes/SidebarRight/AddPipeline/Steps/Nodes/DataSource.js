import React, { useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Radio, Select } from 'antd';
import useVersions from 'hooks/dataSources/useVersions';
import useDataSources from 'hooks/dataSources/useDataSources';
import useSnapshots from 'hooks/dataSources/useSnapshots';
import { VersionRow, checkLatest } from 'components/dataSourceVersions';
import styled from 'styled-components';
import useWizardContext from '../../useWizardContext';
import { Field as RawField } from './../FormUtils';

const ctx = React.createContext();

/** @type {import('./../FormUtils').FieldProps} */
const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const MODES = {
  LATEST: 'Latest',
  VERSION: 'Version',
  SNAPSHOT: 'Snapshot',
};

const RadioGroup = styled(Radio.Group)`
  margin-top: 20px;
`;

const DataSourceNode = ({ id }) => {
  const { form, initialState } = useWizardContext();

  const { dataSources: collection } = useDataSources();

  const [mode, setMode] = useState(
    initialState?.nodes[id]?.spec?.snapshot
      ? MODES.SNAPSHOT
      : initialState?.nodes[id]?.spec?.id
      ? MODES.VERSION
      : MODES.LATEST
  );

  const activeName = form.getFieldValue(['nodes', id, 'spec', 'name']);
  const versionsCollection = useVersions({ name: activeName });
  const snapshots = useSnapshots({ dataSourceName: activeName });

  const handleChangeMode = useCallback(e => setMode(e.target.value), []);

  const disableSnapshot =
    !snapshots?.isReady ||
    !snapshots?.collection ||
    snapshots?.collection.length === 0;
  const disableVersions = !versionsCollection?.versions;

  return (
    <ctx.Provider value={{ rootId: ['nodes', id, 'spec'] }}>
      <Field name={['name']} title="DataSource Name">
        <Select disabled={collection.length === 0}>
          {collection.map(({ name }) => (
            <Select.Option key={`nodes.${id}.spec.name`} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Field>

      <RadioGroup value={mode} onChange={handleChangeMode}>
        <Radio.Button value={MODES.LATEST}>{MODES.LATEST}</Radio.Button>
        <Radio.Button value={MODES.VERSION} disabled={disableVersions}>
          {MODES.VERSION}
        </Radio.Button>
        <Radio.Button value={MODES.SNAPSHOT} disabled={disableSnapshot}>
          {MODES.SNAPSHOT}
        </Radio.Button>
      </RadioGroup>

      {mode === MODES.SNAPSHOT ? (
        <Field name={['snapshot', 'name']} title="Snapshot Name">
          <Select disabled={disableSnapshot}>
            {snapshots?.collection?.map(entry => (
              <Select.Option
                key={`nodes.${id}.spec.version.${entry.id}`}
                value={entry.name}>
                <VersionRow
                  key={entry.id}
                  title={entry.name}
                  isLatest={false}
                  isSnapshot={false}
                />
              </Select.Option>
            ))}
          </Select>
        </Field>
      ) : mode === MODES.VERSION ? (
        <Field name={['id']} title="Version" skipValidation>
          <Select disabled={disableVersions}>
            {versionsCollection?.versions.map(entry => (
              <Select.Option
                key={`nodes.${id}.spec.version.${entry.id}`}
                value={entry.id}>
                <VersionRow
                  key={entry.id}
                  title={entry.id}
                  isLatest={checkLatest(versionsCollection.versions, entry)}
                  isSnapshot={false}
                />
              </Select.Option>
            ))}
          </Select>
        </Field>
      ) : null}
    </ctx.Provider>
  );
};

DataSourceNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default DataSourceNode;
