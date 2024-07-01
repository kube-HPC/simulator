import React from 'react';
import PropTypes from 'prop-types';
import { Button, Radio } from 'antd';
import styled from 'styled-components';
import { checkLatest } from 'components/dataSourceVersions';
import VersionSelect from './VersionSelect';

/**
 * @typedef {import('reducers/dataSources/datasource').DataSource} DataSource
 *
 * @typedef {import('reducers/dataSources/versions').VersionsStateEntry} Version
 *
 * @typedef {import('reducers/dataSources/snapshots').Snapshot} Snapshot
 */
const Container = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RadioGroup = styled(Radio.Group)`
  margin-left: auto;
`;

const ReadOnly = styled(Button)`
  margin-left: auto;
`;

/**
 * @param {{
 *   dataSource: DataSource;
 *   versionsCollection: Version;
 *   goTo: any;
 *   mode: string;
 *   snapshots: Snapshot[];
 *   activeSnapshot: Snapshot;
 * }} props
 */

const TopBar = ({
  dataSource,
  versionsCollection,
  goTo,
  mode,
  snapshots = undefined,
  activeSnapshot = null,
}) => {
  const handleChange = e =>
    typeof goTo[e.target.value] === 'function'
      ? goTo[e.target.value]({ nextDataSourceId: dataSource.id })
      : null;

  const isLatest = checkLatest(versionsCollection.versions, dataSource);
  return (
    <Container>
      <VersionSelect
        dataSource={dataSource}
        snapshots={snapshots}
        versionsCollection={versionsCollection}
        activeSnapshot={activeSnapshot}
      />
      {activeSnapshot ? (
        <ReadOnly disabled>read only</ReadOnly>
      ) : (
        <RadioGroup
          onChange={handleChange}
          value={mode}
          disabled={activeSnapshot !== null}>
          {isLatest && <Radio.Button value="edit">Edit</Radio.Button>}
          <Radio.Button value="query">Query</Radio.Button>
        </RadioGroup>
      )}
    </Container>
  );
};
TopBar.propTypes = {
  // eslint-disable-next-line
  dataSource: PropTypes.any.isRequired,
  // eslint-disable-next-line
  versionsCollection: PropTypes.any.isRequired,
  snapshots: PropTypes.arrayOf(PropTypes.object),
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
  // eslint-disable-next-line
  activeSnapshot: PropTypes.any,
};

export default TopBar;
