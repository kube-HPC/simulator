import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useReadme } from 'hooks';

const TABS = {
  INFO: 'Information',
  DESCRIPTION: 'Description',
};

const PipelineInfo = ({ record }) => {
  const [activeKey, setActiveKey] = useState(TABS.INFO);
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
          const nextReadme = await asyncFetch({ name });
          setReadme(nextReadme);
        };
        fetchReadme();
      }
    },
    [name, asyncFetch]
  );

  return (
    <Card isMargin>
      <Tabs
        onTabClick={onTabClick}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={
          activeKey === TABS.DESCRIPTION && (
            <Button onClick={onApply}>Apply Markdown</Button>
          )
        }>
        <Tabs.TabPane tab={TABS.INFO} key={TABS.INFO}>
          <JsonSwitch obj={record} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={TABS.DESCRIPTION} key={TABS.DESCRIPTION}>
          <MdEditor value={readme} onChange={setReadme} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

PipelineInfo.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default PipelineInfo;
