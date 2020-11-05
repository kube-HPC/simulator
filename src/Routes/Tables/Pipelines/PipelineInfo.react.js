import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useReadme } from 'hooks';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';

const PipelineInfo = ({ record }) => {
  const { tabKey, goTo } = usePath();
  const [readme, setReadme] = useState();

  const { asyncFetch, post } = useReadme(useReadme.TYPES.PIPELINE);
  const { name } = record;

  const onApply = useCallback(() => {
    post({ name, readme });
  }, [post, name, readme]);

  const handleChange = useCallback(
    nextTabKey => goTo.overview({ nextTabKey }),
    [goTo]
  );

  useEffect(() => {
    (!tabKey || !Object.values(TABS).includes(tabKey)) && goTo.overview();
  }, [tabKey, goTo]);

  useEffect(() => {
    if (tabKey === TABS.DESCRIPTION) {
      const fetchReadme = async () => {
        const nextReadme = await asyncFetch({ name });
        setReadme(nextReadme);
      };
      fetchReadme();
    }
  }, [tabKey, asyncFetch, name]);

  return (
    <Card isMargin>
      <Tabs
        activeKey={tabKey}
        onChange={handleChange}
        extra={
          tabKey === TABS.DESCRIPTION && (
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
