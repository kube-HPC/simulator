import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import AlgorithmBuildsTable from './Builds';
import { VersionsTable } from './Versions';
import usePath, { OVERVIEW_TABS as TABS } from './../usePath';

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

  return (
    <Card isMargin>
      <Tabs activeKey={activeKey} onChange={setActiveKey} extra={extra}>
        <Tabs.TabPane tab={TABS.VERSIONS} key={TABS.VERSIONS}>
          <VersionsTable
            algorithmName={algorithm.name}
            currentVersion={algorithm.version}
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
  algorithm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    builds: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(AlgorithmsTabs);
