import React, { useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Radio, Select } from 'antd';
import useVersions from 'hooks/graphql/DataSources/useVersions';
import useDataSources from 'hooks/graphql/DataSources/useDataSource';
import useSnapshots from 'hooks/graphql/DataSources/useSnapshots';
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
  const { form, initialState, setForm } = useWizardContext();

  const { sortedDataSources: collection } = useDataSources();

  const [mode, setMode] = useState(
    initialState?.nodes[id]?.spec?.snapshot
      ? MODES.SNAPSHOT
      : initialState?.nodes[id]?.spec?.id
        ? MODES.VERSION
        : MODES.LATEST
  );

  const activeName = form.getFieldValue(['nodes', id, 'spec', 'name']);
  const { versionsCollection } = useVersions({ name: activeName });
  const { snapshots } = useSnapshots({ dataSourceName: activeName });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeMode = useCallback(
    e => {
      setTimeout(() => {
        setForm();
      }, 500);

      return setMode(e.target.value);
    },
    [setForm]
  );

  const disableSnapshot = useMemo(
    () => snapshots?.length === 0,
    [snapshots?.length]
  );

  const disableVersions = useMemo(
    () => versionsCollection?.length === 0,
    [versionsCollection?.length]
  );

  const contextValue = useMemo(() => ({ rootId: ['nodes', id, 'spec'] }), [id]);

  return (
    <ctx.Provider value={contextValue}>
      <Field name={['name']} title="DataSource Name">
        <Select disabled={collection && collection.length === 0}>
          {collection.map(({ name }) => (
            <Select.Option key={`nodes.${id}.spec.name_${name}`} value={name}>
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
          <Select disabled={disableSnapshot} allowClear>
            {snapshots?.map(entry => (
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
        <Field name={['dataSource', 'id']} title="Version" skipValidation>
          <Select disabled={disableVersions} allowClear>
            {versionsCollection?.versions?.map(entry => (
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
