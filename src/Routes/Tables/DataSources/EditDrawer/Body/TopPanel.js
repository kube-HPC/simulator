import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import styled from 'styled-components';
import VersionSelect from './VersionSelect';

const Container = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RadioGroup = styled(Radio.Group)`
  margin-left: auto;
`;

const TopBar = ({
  dataSource,
  versionsCollection,
  goTo,
  mode,
  snapshots,
  activeSnapshot,
}) => {
  const handleChange = e =>
    typeof goTo[e.target.value] === 'function'
      ? goTo[e.target.value]({ nextDataSourceId: dataSource.id })
      : null;

  return (
    <Container>
      <VersionSelect
        dataSource={dataSource}
        snapshots={snapshots}
        versionsCollection={versionsCollection}
        activeSnapshot={activeSnapshot}
      />
      <RadioGroup
        onChange={handleChange}
        value={mode}
        disabled={activeSnapshot !== null}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="query">Query</Radio.Button>
      </RadioGroup>
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

TopBar.defaultProps = { snapshots: undefined, activeSnapshot: null };

export default TopBar;
