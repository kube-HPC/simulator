import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Card, JsonSwitch, MdEditor } from 'components/common';
import { Button } from 'antd';
import { useReadme } from 'hooks';

const TABS = {
  JSON: 'JSON',
  DESCRIPTION: 'Description',
};

const PipelineTabs = ({ record }) => {
  const [activeKey, setActiveKey] = useState(TABS.JSON);
  const [readme, setReadme] = useState();

  const { asyncFetch, post } = useReadme(useReadme.TYPES.PIPELINE);
  const { name } = record;

  const onApply = () => {
    post({ name, readme });
  };

  const onTabClick = useCallback(
    tab => {
      if (tab === TABS.DESCRIPTION) {
        const fetchReadme = async () => {
          const readme = await asyncFetch({ name });
          setReadme(readme);
        };
        fetchReadme();
      }
    },
    [name],
  );

  return (
    <Card isMargin>
      <Tabs
        onTabClick={onTabClick}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={activeKey === TABS.DESCRIPTION && <Button onClick={onApply}>Apply Markdown</Button>}>
        <Tabs.TabPane tab={TABS.JSON} key={TABS.JSON}>
          <JsonSwitch obj={record} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.DESCRIPTION} key={TABS.DESCRIPTION}>
          <MdEditor value={readme} onChange={setReadme} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

PipelineTabs.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PipelineTabs;
