import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Card, JsonSwitch } from 'components/common';
import AlgorithmBuildsTable from '../AlgorithmBuildsTable.react';
import { VersionsTable } from '../Versions';
import AlgorithmMarkdown from './AlgorithmMarkdown/AlgorithmMarkdown.react';

const TABS = {
  VERSIONS: 'Versions',
  BUILDS: 'Builds',
  JSON: 'JSON',
  DESCRIPTION: 'Description',
};

const AlgorithmsTabs = ({ record: { builds, ...algorithm } }) => {
  const [activeKey, setActiveKey] = useState(TABS.VERSIONS);

  return (
    <Card isMargin>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
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
          <AlgorithmMarkdown algorithmName={algorithm.name} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

AlgorithmsTabs.propTypes = {
  record: PropTypes.object.isRequired,
};

export default AlgorithmsTabs;
