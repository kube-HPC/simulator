import React, { useCallback, useEffect, useState, useMemo } from 'react';
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

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.INFO,
        key: TABS.INFO,
        children: <JsonSwitch obj={record} />,
      },
      {
        label: TABS.DESCRIPTION,
        key: TABS.DESCRIPTION,
        children: <MdEditor value={readme} onChange={setReadme} />,
      },
    ],
    [readme, record]
  );

  return (
    <Card isMargin>
      <Tabs
        items={TabsItemsJson}
        activeKey={tabKey}
        onChange={handleChange}
        extra={
          tabKey === TABS.DESCRIPTION && (
            <Button onClick={onApply}>Apply Markdown</Button>
          )
        }
      />
    </Card>
  );
};

PipelineInfo.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default React.memo(PipelineInfo);
