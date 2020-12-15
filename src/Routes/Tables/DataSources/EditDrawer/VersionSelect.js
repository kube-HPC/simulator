import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectors } from 'reducers';
import { fetchDataSourceVersions } from 'actions/dataSources';
import styled from 'styled-components';

const Container = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const VersionDescription = styled.p`
  padding: 0;
  margin: 0;
  margin-left: 2ch;
`;

/**
 * @param {{
 *   dataSource: import('reducers/dataSources/datasource').DataSource;
 * }} params
 */
const Versions = ({ dataSource }) => {
  const dispatch = useDispatch();

  const versionsCollection = useSelector(state =>
    selectors.dataSources.versions(state, dataSource.name)
  );
  useEffect(() => {
    if (versionsCollection.status === 'IDLE') {
      dispatch(fetchDataSourceVersions(dataSource));
    }
  }, [dispatch, versionsCollection, dataSource]);

  const menu = (
    <Menu>
      {versionsCollection.versions.map(version => (
        <Menu.Item key={`dataSource-version-${version.id}`}>
          <Link to={`/datasources/${version.id}/edit`}>{version.id}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
  const isPending = versionsCollection.status === 'PENDING';
  return (
    <Container>
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button loading={isPending}>
          {isPending ? 'versions' : dataSource.id}
        </Button>
      </Dropdown>
      <VersionDescription>{dataSource.versionDescription}</VersionDescription>
    </Container>
  );
};

Versions.propTypes = {
  dataSource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    versionDescription: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
export default Versions;
