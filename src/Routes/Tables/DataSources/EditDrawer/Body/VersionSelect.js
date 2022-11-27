import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CopyOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import { VersionRow, checkLatest } from 'components/dataSourceVersions';
import { copyToClipboard } from 'utils';
import usePath from './../../usePath';
import useActiveSnapshot from './useActiveSnapshot';

/**
 * @typedef {import('./').ExtendedDataSource} ExtendedDataSource
 *
 * @typedef {import('reducers/dataSources/datasource').DataSourceVersion} DataSourceVersion
 *
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 *
 * @typedef {import('../../usePath').SideBarMode} SideBarMode
 *
 * @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus
 */

const VersionDescription = styled.p`
  padding: 0;
  margin: 0;
  margin-left: 2ch;
`;

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
  hasMissingSnapshot,
}) => {
  const { paths, mode, goTo } = usePath();
  const location = useLocation();
  const isLatest = checkLatest(versions, dataSource);

  const menuItemsJson = useMemo(() => {
    const items = [];

    entries.forEach(entry => {
      const isSnapshot = !!entry.query;

      items.push({
        label: (
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
              isLatest={checkLatest(versions, entry)}
              isSnapshot={isSnapshot}
              collection={entries}
            />
          </Link>
        ),
        key: `dataSource-versions-entry-${entry.id}`,
      });
    });

    return items;
  }, [entries, location.search, mode, paths, versions]);

  if (mode === 'edit' && !isLatest) goTo.query();

  if (isPending || entries.length === 0 || !dataSource) {
    return <Button loading>loading versions</Button>;
  }

  const menu = <Menu items={menuItemsJson} />;

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button loading={isPending}>
        <VersionRow
          title={
            hasMissingSnapshot
              ? 'missing snapshot!'
              : activeSnapshot
              ? activeSnapshot.name
              : dataSource.id
          }
          isLatest={hasMissingSnapshot ? '' : isLatest}
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
  hasMissingSnapshot: PropTypes.bool,
};

Selector.defaultProps = {
  entries: [],
  activeSnapshot: null,
  hasMissingSnapshot: false,
};

const CopyButton = styled(Button)`
  margin-left: 1ch;
`;

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
    if (snapshots && snapshots.length === 0) return versions;
    const snapshotsByVersion = _.groupBy(snapshots, 'dataSource.id');
    return versions?.reduce(
      (acc, version) =>
        snapshotsByVersion[version.id]
          ? acc.concat(version).concat(snapshotsByVersion[version.id])
          : acc.concat(version),
      []
    );
  }, [snapshots, versionsCollection]);

  const { snapshotName } = useActiveSnapshot({
    dataSourceName: dataSource?.name,
  });

  const handleCopy = useCallback(() => {
    let payload = null;
    if (!snapshotName) {
      payload = {
        spec: {
          name: dataSource.name,
          dataSource: {
            id: dataSource.id,
          },
        },
      };
    } else {
      payload = {
        spec: {
          name: dataSource.name,
          snapshot: {
            name: snapshotName,
          },
        },
      };
    }
    if (payload) {
      copyToClipboard(JSON.stringify(payload, null, 2));
    }
  }, [snapshotName, dataSource]);
  const hasMissingSnapshot = snapshotName && !activeSnapshot;
  // console.log("Selector versionsCollection",versionsCollection,isPending)
  // console.log("Selector dataSource",dataSource)
  // console.log("Selector activeSnapshot",activeSnapshot,hasMissingSnapshot)
  return (
    <>
      <Selector
        versions={versionsCollection?.versions}
        entries={combinedItems}
        isPending={isPending}
        dataSource={dataSource}
        activeSnapshot={activeSnapshot}
        hasMissingSnapshot={hasMissingSnapshot}
      />
      <Tooltip
        title={
          snapshotName
            ? 'Copy DataSource & Snapshot Name'
            : 'Copy DataSource ID'
        }>
        <CopyButton onClick={handleCopy} type="dashed">
          <CopyOutlined />
        </CopyButton>
      </Tooltip>
      <VersionDescription>
        {activeSnapshot
          ? ''
          : hasMissingSnapshot
          ? '<- version selector'
          : dataSource?.versionDescription}
      </VersionDescription>
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
