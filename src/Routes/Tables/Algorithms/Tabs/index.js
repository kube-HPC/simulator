import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import { OVERVIEW_TABS as TABS } from 'const';
import AlgorithmBuildsTable from './Builds';
import { VersionsTable } from './Versions';
import usePath from './../usePath';

const AlgorithmsTabs = ({ algorithm }) => {
  const { tabKey: activeKey, goTo } = usePath();
  const setActiveKey = useCallback(tab => goTo.overview({ nextTabKey: tab }), [
    goTo,
  ]);

  const [readme, setReadme] = useState();

  const { asyncFetch, post } = useReadme(useReadme.TYPES.ALGORITHM);

  const { fetch } = useVersions({ algorithmName: algorithm.name });

  const onApply = useCallback(() => {
    post({ name: algorithm.name, readme });
  }, [post, algorithm, readme]);

  useEffect(() => {
    if (activeKey !== TABS.DESCRIPTION) return;
    asyncFetch({ name: algorithm.name }).then(setReadme);
  }, [asyncFetch, algorithm, activeKey]);

  const extra =
    activeKey === TABS.DESCRIPTION ? (
      <Button onClick={onApply} icon={<CheckOutlined />}>
        Apply Markdown
      </Button>
    ) : activeKey === TABS.VERSIONS ? (
      <Button onClick={fetch} icon={<RedoOutlined />}>
        Refresh
      </Button>
    ) : null;

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.VERSIONS,
        key: TABS.VERSIONS,
        children: (
          <VersionsTable
            algorithmName={algorithm.name}
            currentVersion={algorithm.version}
            isFetch={activeKey === TABS.VERSIONS}
          />
        ),
      },
      {
        label: TABS.BUILDS,
        key: TABS.BUILDS,
        children: <AlgorithmBuildsTable builds={algorithm.builds} />,
      },
      {
        label: TABS.INFO,
        key: TABS.INFO,
        forceRender: true,
        children: <JsonSwitch obj={algorithm} />,
      },
      {
        label: TABS.DESCRIPTION,
        key: TABS.DESCRIPTION,
        children: <MdEditor value={readme} onChange={setReadme} />,
      },
    ],
    [activeKey, algorithm, readme]
  );

  return (
    <Card isMargin>
      <Tabs
        items={TabsItemsJson}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={extra}
      />
    </Card>
  );
};

AlgorithmsTabs.propTypes = {
  algorithm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    builds: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(AlgorithmsTabs);
