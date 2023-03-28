import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Card, JsonSwitch, MdEditor, Tabs } from 'components/common';
import { useReadme, useVersions } from 'hooks';
import PropTypes from 'prop-types';
import { OVERVIEW_TABS as TABS } from 'const';
import AlgorithmBuildsTable from './Builds';
import { VersionsTable } from './Versions';
import usePath from './../usePath';

const AlgorithmsTabs = ({ algorithm }) => {
  const isFirstRender = useRef(true);
  const { tabKey: activeKey, goTo } = usePath();
  const setActiveKey = useCallback(tab => goTo.overview({ nextTabKey: tab }), [
    goTo,
  ]);

  const [readme, setReadme] = useState();
  const [isBuildFirstFail] = useState(
    algorithm?.builds.lenght > 0 && algorithm?.builds[0]?.status === 'failed'
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

  const { dataSource, onApply, onDelete, fetch } = useVersions({
    algorithmName: algorithm.name,
    confirmPopupForceVersion,
    isFetch: true,
  });

  const onApplyApplyMarkdown = useCallback(() => {
    post({ name: algorithm.name, readme });
  }, [post, algorithm, readme]);

  useEffect(() => {
    if (activeKey !== TABS.DESCRIPTION) return;
    asyncFetch({ name: algorithm.name }).then(setReadme);
  }, [asyncFetch, algorithm, activeKey]);

  const extra =
    activeKey === TABS.DESCRIPTION ? (
      false && (
        <Button onClick={onApplyApplyMarkdown} icon={<CheckOutlined />}>
          Apply Markdown
        </Button>
      )
    ) : activeKey === TABS.VERSIONS ? (
      <Button onClick={fetch} icon={<RedoOutlined />}>
        Refresh
      </Button>
    ) : null;

  useEffect(() => {
    if (isFirstRender.current && isBuildFirstFail) {
      isFirstRender.current = false;
      setActiveKey(TABS.BUILDS);
    }

    return null;
  }, []);

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.VERSIONS,
        key: TABS.VERSIONS,
        children: (
          <VersionsTable
            algorithmName={algorithm.name}
            currentVersion={algorithm.version}
            isFetch={activeKey === TABS.VERSIONS}
            dataSource={dataSource}
            onApply={onApply}
            onDelete={onDelete}
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
      readme,
    ]
  );

  return (
    <Card isMargin>
      <Tabs
        items={TabsItemsJson}
        activeKey={activeKey}
        onChange={setActiveKey}
        extra={extra}
      />
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
