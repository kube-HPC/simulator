import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import usePath from './../../usePath';
/**
 * @typedef {import('./').ExtendedDataSource} ExtendedDataSource
 * @typedef {import('reducers/dataSources/datasource').DataSourceVersion} DataSourceVersion
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 * @typedef {import('../../usePath').SideBarMode} SideBarMode
 * @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus
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

/**
 * @param {{
 *   version: DataSourceVersion;
 *   isLatest: boolean;
 * }} props
 */
const VersionRow = ({ title, isLatest, isSnapshot }) => (
  <>
    <span>{title}</span>
    <VersionTag>
      {isSnapshot ? 'Snapshot' : isLatest ? 'Latest' : 'Raw'}
    </VersionTag>
  </>
);
VersionRow.propTypes = {
  title: PropTypes.string.isRequired,
  isLatest: PropTypes.bool.isRequired,
  isSnapshot: PropTypes.bool,
};
VersionRow.defaultProps = {
  isSnapshot: false,
};

const isLatest = (collection, entry) => _.last(collection).id === entry.id;

/**
 * @param {{
 *   entries: (DataSourceVersion | Snapshot)[];
 *   isPending: boolean;
 *   dataSource: ExtendedDataSource;
 *   versions: DataSourceVersion[];
 *   activeSnapshot?: Snapshot;
 * }}
 */
const Selector = ({
  entries,
  isPending,
  dataSource,
  versions,
  activeSnapshot,
}) => {
  const { paths, mode } = usePath();
  const location = useLocation();
  if (isPending || entries.length === 0 || !dataSource)
    return <Button loading>loading versions</Button>;

  const menu = (
    <Menu>
      {entries.map(entry => {
        const isSnapshot = !!entry.query;
        return (
          <Menu.Item key={`dataSource-versions-entry-${entry.id}`}>
            <Link
              to={{
                pathname: isSnapshot
                  ? paths.snapshot({
                      nextDataSourceId: entry.dataSource.id,
                      nextSnapshotName: entry.name,
                    })
                  : paths[mode]({ nextDataSourceId: entry.id }),
                search: location.search,
              }}>
              <VersionRow
                title={isSnapshot ? entry.name : entry.id}
                isLatest={isLatest(versions, entry)}
                isSnapshot={isSnapshot}
                collection={entries}
              />
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button loading={isPending}>
        <VersionRow
          title={activeSnapshot ? activeSnapshot.name : dataSource.id}
          isLatest={isLatest(versions, dataSource)}
          isSnapshot={activeSnapshot !== null}
        />
      </Button>
    </Dropdown>
  );
};

Selector.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  isPending: PropTypes.bool.isRequired,
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    snapshot: PropTypes.shape({
      name: PropTypes.string,
    }),
    isSnapshot: PropTypes.bool,
  }).isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeSnapshot: PropTypes.shape({
    name: PropTypes.string,
  }),
};

Selector.defaultProps = {
  entries: [],
  activeSnapshot: null,
};

/**
 * @param {{
 *   dataSource: ExtendedDataSource;
 *   versionsCollection: {
 *     versions: DataSourceVersion[];
 *     status: FetchStatus;
 *   };
 *   snapshots: Snapshot[];
 *   mode: SideBarMode;
 *   activeSnapshot?: Snapshot;
 * }} params
 */
const Versions = ({
  dataSource,
  versionsCollection,
  snapshots,
  activeSnapshot,
}) => {
  const isPending = versionsCollection?.status === 'PENDING' ?? true;
  const combinedItems = useMemo(() => {
    const { versions } = versionsCollection;
    if (snapshots.length === 0) return versions;
    const snapshotsByVersion = _.groupBy(snapshots, 'dataSource.id');
    return versions.reduce(
      (acc, version) =>
        snapshotsByVersion[version.id]
          ? acc.concat(version).concat(snapshotsByVersion[version.id])
          : acc.concat(version),
      []
    );
  }, [snapshots, versionsCollection]);
  return (
    <>
      <Selector
        versions={versionsCollection.versions}
        entries={combinedItems}
        isPending={isPending}
        dataSource={dataSource}
        activeSnapshot={activeSnapshot}
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
    snapshot: PropTypes.shape({ id: PropTypes.string }),
  }).isRequired,
  versionsCollection: PropTypes.shape({
    status: PropTypes.string,
    versions: PropTypes.arrayOf(
      PropTypes.shape({ versionDescription: PropTypes.string.isRequired })
    ),
  }).isRequired,
  snapshots: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line
  activeSnapshot: PropTypes.any,
};

Versions.defaultProps = {
  snapshots: [],
  activeSnapshot: null,
};

export default Versions;
