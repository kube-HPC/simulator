import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { ReactComponent as IconCompare } from 'images/compare.svg';
import { Button, Checkbox, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import {
  Card,
  JsonSwitch,
  MdEditor,
  Tabs,
  JsonDiffTable,
} from 'components/common';
import { useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import { OVERVIEW_TABS as TABS } from 'const';
import { VersionsTable } from 'components';
import AlgorithmBuildsTable from './Builds';
import usePath from './../usePath';

const AlgorithmsTabs = ({ algorithm }) => {
  const isFirstRender = useRef(true);
  const { tabKey: activeKey, goTo } = usePath();
  const setActiveKey = useCallback(
    tab => goTo.overview({ nextTabKey: tab }),
    [goTo]
  );

  const [versionsCompare, setVersionsCompare] = useState([]);
  const [readme, setReadme] = useState();
  const [isCompareVisible, setCompareVisible] = useState(false);
  const [compareJsonPair, setCompareJsonPair] = useState({
    json1: null,
    json2: null,
  });

  const [isBuildFirstFail] = useState(
    algorithm?.builds?.length > 0 && algorithm?.builds[0]?.status === 'failed'
  );

  const { asyncFetch, post } = useReadme(useReadme.TYPES.ALGORITHM);

  const confirmPopupForceVersion = (
    resError,
    name,
    version,
    applyVersionCallback
  ) => {
    let isForce = false;
    Modal.confirm({
      title: 'WARNING : Version not upgrade',
      content: (
        <>
          <div>
            <Text>{resError.error.message}</Text>
          </div>
          <Checkbox
            onClick={e => {
              isForce = e.target.checked;
            }}>
            Stop running algorithms.
          </Checkbox>
        </>
      ),
      okText: 'Try again',
      okType: 'danger',
      cancelText: 'Cancel',
      onCancel() {},
      onOk() {
        setTimeout(() => {
          applyVersionCallback({ name, version, force: isForce });
        }, 100);
      },
    });
  };

  const { dataSource, onApply, onDelete, onSaveAs, fetch } = useVersions({
    nameId: algorithm.name,
    confirmPopupForceVersion,
    isFetch: true,
    urlRestData: 'algorithms',
  });

  const onApplyApplyMarkdown = useCallback(() => {
    post({ name: algorithm.name, readme });
  }, [post, algorithm, readme]);

  useEffect(() => {
    if (activeKey !== TABS.DESCRIPTION) return;
    asyncFetch({ name: algorithm.name }).then(setReadme);
  }, [asyncFetch, algorithm, activeKey]);

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

    if (json1?.algorithm?.modified > json2?.algorithm?.modified) {
      [json1, json2] = [json2, json1];
    }

    setCompareJsonPair({ json1, json2 });
    setCompareVisible(true);
  };

  const extra =
    activeKey === TABS.DESCRIPTION ? (
      false && (
        <Button onClick={onApplyApplyMarkdown} icon={<CheckOutlined />}>
          Apply Markdown
        </Button>
      )
    ) : activeKey === TABS.VERSIONS ? (
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

  useEffect(() => {
    if (isFirstRender.current && isBuildFirstFail) {
      isFirstRender.current = false;
      setActiveKey(TABS.BUILDS);
    }
  }, [isBuildFirstFail, setActiveKey]);

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.VERSIONS,
        key: TABS.VERSIONS,
        children: (
          <VersionsTable
            currentVersion={algorithm.version}
            isFetch={activeKey === TABS.VERSIONS}
            dataSource={dataSource}
            onApply={onApply}
            onDelete={onDelete}
            onSaveAs={onSaveAs}
            source="algorithms"
            setVersionsCompare={setVersionsCompare}
          />
        ),
      },
      {
        label: TABS.BUILDS,
        key: TABS.BUILDS,
        children: (
          <AlgorithmBuildsTable
            builds={algorithm.builds}
            isOpenFirstLog={isFirstRender && isBuildFirstFail}
          />
        ),
      },
      {
        label: TABS.INFO,
        key: TABS.INFO,
        forceRender: true,
        children: <JsonSwitch obj={algorithm} />,
      },
      {
        label: TABS.DESCRIPTION,
        key: TABS.DESCRIPTION,
        children: <MdEditor value={readme} onChange={setReadme} viewReadOnly />,
      },
    ],
    [
      activeKey,
      algorithm,
      dataSource,
      isBuildFirstFail,
      isFirstRender,
      onApply,
      onDelete,
      onSaveAs,
      readme,
    ]
  );

  return (
    <>
      <Card isMargin>
        <Tabs
          items={TabsItemsJson}
          activeKey={activeKey}
          onChange={setActiveKey}
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
              currentCompareProp="algorithm"
            />
          )}
        </div>
      </Modal>
    </>
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
