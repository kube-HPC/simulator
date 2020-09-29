import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useAlgorithm, useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import AlgorithmBuildsTable from './Builds/AlgorithmBuildsTable.react';
import { VersionsTable } from './Versions';

const TABS = {
  VERSIONS: 'Versions',
  BUILDS: 'Builds',
  INFO: 'Information',
  DESCRIPTION: 'Description',
};

const AlgorithmsTabs = ({ name }) => {
  const [activeKey, setActiveKey] = useState(TABS.VERSIONS);
  const [readme, setReadme] = useState();

  const { algorithm } = useAlgorithm(name);

  const { asyncFetch, post } = useReadme(useReadme.TYPES.ALGORITHM);

  const { fetch } = useVersions({ algorithmName: algorithm.name });

  const onApply = () => {
    post({ name, readme });
  };

  const onTabClick = tab => {
    if (tab === TABS.DESCRIPTION) {
      const fetchReadme = async () => {
        const nextReadme = await asyncFetch({ name });
        setReadme(nextReadme);
      };
      fetchReadme();
    }
  };

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
      <Tabs
        onTabClick={onTabClick}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={extra}>
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
