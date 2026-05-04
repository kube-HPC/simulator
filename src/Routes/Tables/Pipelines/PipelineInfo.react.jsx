import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import {
  Card,
  JsonSwitch,
  MdEditorView,
  Tabs,
  JsonDiffTable,
} from 'components/common';
import { ReactComponent as IconCompare } from 'images/compare.svg';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { useReadme, useVersions } from 'hooks';
import { VersionsTable, AuditTrailTable } from 'components';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';

const PipelineInfo = ({ pipeline, onClose }) => {
  const { name, version } = pipeline;

  const {
    dataSource,
    onApply: onApplyVersion,
    onDelete,
    onSaveAs,
    fetch,
  } = useVersions({
    nameId: name,
    confirmPopupForceVersion: null,
    isFetch: true,
    urlRestData: 'pipelines',
    onSaveAsSuccess: onClose,
  });

  const { tabKey, goTo } = usePath();
  const [versionsCompare, setVersionsCompare] = useState([]);
  const [readme, setReadme] = useState();
  const [isCompareVisible, setCompareVisible] = useState(false);
  const [compareJsonPair, setCompareJsonPair] = useState({
    json1: null,
    json2: null,
  });

  const { asyncFetch, post } = useReadme(useReadme.TYPES.PIPELINE);

  const onApplyApplyMarkdown = useCallback(() => {
    post({ name, readme });
  }, [post, name, readme]);

  const CompareJson = () => {
    if (versionsCompare.length !== 2) {
      Modal.warning({
        title: 'Please select exactly 2 versions to compare',
      });
      return;
    }

    let json1 = dataSource.find(item => item.version === versionsCompare[0]);
    let json2 = dataSource.find(item => item.version === versionsCompare[1]);

    if (!json1 || !json2) {
      Modal.error({
        title: 'Error finding selected versions',
        content: 'Could not locate both selected versions in dataSource.',
      });
      return;
    }

    if (json1.pipeline.modified > json2.pipeline.modified) {
      [json1, json2] = [json2, json1];
    }

    setCompareJsonPair({ json1, json2 });
    setCompareVisible(true);
  };

  const extra =
    tabKey === TABS.DESCRIPTION ? (
      false && (
        <Button onClick={onApplyApplyMarkdown} icon={<CheckOutlined />}>
          Apply Markdown
        </Button>
      )
    ) : tabKey === TABS.VERSIONS ? (
      <>
        <Button onClick={fetch} icon={<RedoOutlined />}>
          Refresh
        </Button>{' '}
        <Button
          disabled={versionsCompare.length !== 2}
          onClick={CompareJson}
          icon={<IconCompare style={{ width: '14px' }} />}>
          Compare
        </Button>
      </>
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
            onSaveAs={onSaveAs}
            source="pipelines"
            setVersionsCompare={setVersionsCompare}
          />
        ),
      },
      {
        label: TABS.VERSIONSTIMETABLE,
        key: TABS.VERSIONSTIMETABLE,
        children: <AuditTrailTable auditTrail={pipeline.auditTrail} />,
      },
      {
        label: TABS.DESCRIPTION,
        key: TABS.DESCRIPTION,
        children: (
          <MdEditorView value={readme} onChange={setReadme} viewReadOnly />
        ),
      },
    ],
    [
      pipeline,
      readme,
      version,
      tabKey,
      dataSource,
      onApplyVersion,
      onDelete,
      onSaveAs,
    ]
  );

  return (
    <>
      <Card isMargin>
        <Tabs
          items={TabsItemsJson}
          activeKey={tabKey}
          onChange={handleChange}
          extra={extra}
        />
      </Card>

      <Modal
        title="Compare Versions"
        open={isCompareVisible}
        onCancel={() => setCompareVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCompareVisible(false)}>
            Close
          </Button>,
        ]}
        width={900}>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {compareJsonPair.json1 && compareJsonPair.json2 && (
            <JsonDiffTable
              json1={compareJsonPair.json1}
              json2={compareJsonPair.json2}
              idKey="pipeline"
              currentCompareProp="pipeline"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

PipelineInfo.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

export default React.memo(PipelineInfo);
