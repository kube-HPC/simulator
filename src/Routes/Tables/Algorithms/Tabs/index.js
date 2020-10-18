import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useAlgorithm, useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import AlgorithmBuildsTable from './Builds/AlgorithmBuildsTable.react';
import { VersionsTable } from './Versions';
import usePath, { OVERVIEW_TABS as TABS } from './../usePath';

const AlgorithmsTabs = ({ name }) => {
  const { tabKey: activeKey, goTo } = usePath();
  const setActiveKey = useCallback(tab => goTo.overview({ nextTabKey: tab }), [
    goTo,
  ]);

  const [readme, setReadme] = useState();

  const { algorithm } = useAlgorithm(name);

  const { asyncFetch, post } = useReadme(useReadme.TYPES.ALGORITHM);

  const { fetch } = useVersions({ algorithmName: algorithm.name });

  const onApply = useCallback(() => {
    post({ name, readme });
  }, [post, name, readme]);

  useEffect(() => {
    if (activeKey !== TABS.DESCRIPTION) return;
    asyncFetch({ name }).then(setReadme);
  }, [asyncFetch, name, activeKey]);

  const extra =
    activeKey === TABS.DESCRIPTION ? (
      <Button onClick={onApply} icon="check">
        Apply Markdown
      </Button>
    ) : activeKey === TABS.VERSIONS ? (
      <Button onClick={fetch} icon="redo">
        Refresh
      </Button>
    ) : null;

  return (
    <Card isMargin>
      <Tabs activeKey={activeKey} onChange={setActiveKey} extra={extra}>
        <Tabs.TabPane tab={TABS.VERSIONS} key={TABS.VERSIONS}>
          <VersionsTable
            algorithmName={algorithm.name}
            currentVersion={algorithm.algorithmImage}
            isFetch={activeKey === TABS.VERSIONS}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.BUILDS} key={TABS.BUILDS}>
          <AlgorithmBuildsTable builds={algorithm.builds} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.INFO} key={TABS.INFO} forceRender>
          <JsonSwitch obj={algorithm} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.DESCRIPTION} key={TABS.DESCRIPTION}>
          <MdEditor value={readme} onChange={setReadme} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

AlgorithmsTabs.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AlgorithmsTabs;
