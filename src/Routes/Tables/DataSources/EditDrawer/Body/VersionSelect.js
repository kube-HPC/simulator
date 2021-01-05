import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';

/**
 * @typedef {import('reducers/dataSources/datasource').DataSource} DataSource
 * @typedef {import('reducers/dataSources/datasource').DataSourceVersion} DataSourceVersion
 */

const VersionDescription = styled.p`
  padding: 0;
  margin: 0;
  margin-left: 2ch;
`;

const VersionTag = styled.span`
  float: right;
  margin-left: 5ch;
  font-weight: bold;
`;

/** @param {{ version: DataSourceVersion; collection: DataSourceVersion[] }} props */
const VersionRow = ({ version, collection }) => (
  <>
    <span>{version.id}</span>
    <VersionTag>
      {_.last(collection).id === version.id ? 'Latest' : 'Raw'}
    </VersionTag>
  </>
);
VersionRow.propTypes = {
  version: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  collection: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired
  ).isRequired,
};

/**
 * @param {{
 *   versions: DataSourceVersion[];
 *   isPending: boolean;
 *   dataSource: DataSource;
 * }} params
 */
const Selector = ({ versions, isPending, dataSource }) => {
  if (isPending || versions.length === 0 || !dataSource)
    return <Button loading>loading versions</Button>;

  const menu = (
    <Menu>
      {versions.map(version => (
        <Menu.Item key={`dataSource-version-${version.id}`}>
          <Link to={`/datasources/${version.id}/edit`}>
            <VersionRow version={version} collection={versions} />
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button loading={isPending}>
        <VersionRow version={dataSource} collection={versions} />
      </Button>
    </Dropdown>
  );
};

Selector.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.shape({})),
  isPending: PropTypes.bool.isRequired,
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
Selector.defaultProps = {
  versions: null,
};

/**
 * @param {{
 *   dataSource: DataSource;
 *   versionsCollection: {
 *     versions: DataSourceVersion[];
 *     status: string;
 *   };
 * }} params
 */
const Versions = ({ dataSource, versionsCollection }) => {
  const isPending = versionsCollection?.status === 'PENDING' ?? true;
  return (
    <>
      <Selector
        versions={versionsCollection.versions}
        isPending={isPending}
        dataSource={dataSource}
      />
      <VersionDescription>{dataSource.versionDescription}</VersionDescription>
    </>
  );
};

Versions.propTypes = {
  dataSource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    versionDescription: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  versionsCollection: PropTypes.shape({
    status: PropTypes.string,
    versions: PropTypes.arrayOf(
      PropTypes.shape({ versionDescription: PropTypes.string.isRequired })
    ),
  }).isRequired,
};
export default Versions;
