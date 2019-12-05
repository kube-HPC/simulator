import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Card, JsonSwitch, MdEditor } from 'components/common';
import AlgorithmBuildsTable from './Builds/AlgorithmBuildsTable.react';
import { VersionsTable } from './Versions';
import { Button } from 'antd';
import { useAlgorithmReadme } from 'hooks';

const TABS = {
  VERSIONS: 'Versions',
  BUILDS: 'Builds',
  JSON: 'JSON',
  DESCRIPTION: 'Description',
};

const AlgorithmsTabs = ({ record: { builds, ...algorithm } }) => {
  const [activeKey, setActiveKey] = useState(TABS.VERSIONS);
  const [readme, setReadme] = useState();

  const { name } = algorithm;

  const { asyncFetch, post } = useAlgorithmReadme();

  const onApply = () => {
    post({ name, readme });
  };

  const onTabClick = tab => {
    if (tab === TABS.DESCRIPTION) {
      const fetchReadme = async () => {
        const readme = await asyncFetch({ name });
        setReadme(readme);
      };
      fetchReadme();
    }
  };

  return (
    <Card isMargin>
      <Tabs
        onTabClick={onTabClick}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={activeKey === TABS.DESCRIPTION && <Button onClick={onApply}>Apply Markdown</Button>}>
        <Tabs.TabPane tab={TABS.VERSIONS} key={TABS.VERSIONS}>
          <VersionsTable
            algorithmName={algorithm.name}
            currentVersion={algorithm.algorithmImage}
            isFetch={activeKey === TABS.VERSIONS}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.BUILDS} key={TABS.BUILDS}>
          <AlgorithmBuildsTable builds={builds} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.JSON} key={TABS.JSON} forceRender>
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
  record: PropTypes.object.isRequired,
};

export default AlgorithmsTabs;
