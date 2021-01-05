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

const TopBar = ({ dataSource, versionsCollection, goTo, mode }) => {
  const handleChange = e => {
    if (typeof goTo[e.target.value] === 'function')
      return goTo[e.target.value]({ nextDataSourceId: dataSource.id });
    return null;
  };

  return (
    <Container>
      <VersionSelect
        dataSource={dataSource}
        versionsCollection={versionsCollection}
      />
      <RadioGroup onChange={handleChange} value={mode}>
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
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
};
export default TopBar;
