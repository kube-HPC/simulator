import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { useReadme, useVersions } from 'hooks';
import { VersionsTable } from './../Algorithms/Tabs/Versions';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';

const PipelineInfo = ({ pipeline }) => {
  const { name, version } = pipeline;

  const {
    dataSource,
    onApply: onApplyVersion,
    onDelete,
    fetch,
  } = useVersions({
    nameId: name,
    confirmPopupForceVersion: null,
    isFetch: true,
    urlRestData: 'pipelines',
  });

  const { tabKey, goTo } = usePath();
  const [readme, setReadme] = useState();

  const { asyncFetch, post } = useReadme(useReadme.TYPES.PIPELINE);

  const onApplyApplyMarkdown = useCallback(() => {
    post({ name, readme });
  }, [post, name, readme]);

  const extra =
    tabKey === TABS.DESCRIPTION ? (
      false && (
        <Button onClick={onApplyApplyMarkdown} icon={<CheckOutlined />}>
          Apply Markdown
        </Button>
      )
    ) : tabKey === TABS.VERSIONS ? (
      <Button onClick={fetch} icon={<RedoOutlined />}>
        Refresh
      </Button>
    ) : null;

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
        children: <JsonSwitch obj={pipeline} isGraph typeDefaultView="Graph" />,
      },

      {
        label: TABS.VERSIONS,
        key: TABS.VERSIONS,
        children: (
          <VersionsTable
            currentVersion={version}
            isFetch={tabKey === TABS.VERSIONS}
            dataSource={dataSource}
            onApply={onApplyVersion}
            onDelete={onDelete}
            source="pipelines"
          />
        ),
      },
      {
        label: TABS.DESCRIPTION,
        key: TABS.DESCRIPTION,
        children: <MdEditor value={readme} onChange={setReadme} viewReadOnly />,
      },
    ],
    [pipeline, readme, version, tabKey, dataSource, onApplyVersion, onDelete]
  );

  return (
    <Card isMargin>
      <Tabs
        items={TabsItemsJson}
        activeKey={tabKey}
        onChange={handleChange}
        extra={extra}
      />
    </Card>
  );
};

PipelineInfo.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

export default React.memo(PipelineInfo);
