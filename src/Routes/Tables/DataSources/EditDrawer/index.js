import React, { useCallback } from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import { useActions } from 'hooks';
import usePath from './../usePath';
import useActiveDataSource from './../useActiveDataSource';
import Header from './Header';
import Body from './Body';
import ErrorPage from './Body/Error';
import { Bold } from './Body/styles';

const EditDrawer = () => {
  const { goTo, dataSourceId, mode, snapshotName } = usePath();
  const {
    dataSource,
    isReady,
    status,
    collectionStatus,
  } = useActiveDataSource();
  const { setOff, isOn } = useToggle(true);
  const { retryFetchDataSource, retryFetchDataSources } = useActions();
  const handleRetry = useCallback(() => {
    if (collectionStatus === 'SUCCESS') {
      retryFetchDataSource(dataSourceId);
    }
    retryFetchDataSources();
  }, [
    retryFetchDataSource,
    retryFetchDataSources,
    dataSourceId,
    collectionStatus,
  ]);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      style={{ display: 'flex', flexDirection: 'column' }}
      width={DRAWER_SIZE.EDIT_DATASOURCE}>
      <TabDrawer>
        <TabDrawerText>{DRAWER_TITLES.EDIT_DATASOURCE}</TabDrawerText>
      </TabDrawer>

      <Header
        status={status}
        dataSourceId={dataSourceId}
        dataSourceName={dataSource?.name}
        git={dataSource?.git}
        storage={dataSource?.storage}
      />

      {isReady ? (
        <Body goTo={goTo} mode={mode} snapshotName={snapshotName} />
      ) : status === 'FAIL' ? (
        <ErrorPage
          onRetry={handleRetry}
          dataSourceId={dataSourceId}
          collectionStatus={collectionStatus}>
          {collectionStatus === 'SUCCESS' ? (
            <span>
              Could not fetch dataSource <Bold>{dataSourceId}</Bold>
            </span>
          ) : (
            <span>Could not fetch dataSources collection</span>
          )}
        </ErrorPage>
      ) : null}
    </Drawer>
  );
};

export default EditDrawer;
