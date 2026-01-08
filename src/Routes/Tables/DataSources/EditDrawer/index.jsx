import React from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';

import { useActiveDataSource } from 'hooks/graphql';
import usePath from '../usePath';

import Header from './Header';
import Body from './Body';
// import ErrorPage from './Body/Error';
// import { Bold } from './Body/styles';

const EditDrawer = () => {
  const { goTo, dataSourceId, dataSourceName, mode, snapshotName } = usePath();

  // get dataSource by Id
  const {
    activeDataSource,
    queryData,
    //  isReady,
    //   status,
    //  collectionStatus,
  } = useActiveDataSource(dataSourceName, dataSourceId);

  const { setOff, isOn } = useToggle(true);
  // const { retryFetchDataSource, retryFetchDataSources } = useActions();
  /* const handleRetry = useCallback(() => {
    if (collectionStatus === 'SUCCESS') {
      retryFetchDataSource(dataSourceId);
    }
    retryFetchDataSources();
  }, [
    retryFetchDataSource,
    retryFetchDataSources,
    dataSourceId,
    collectionStatus,
  ]); */

  if (queryData.loading) return 'Loading...';
  if (queryData.error) return `Error! ${queryData.error.message}`;

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

      {Object.keys(activeDataSource).length > 0 && (
        <>
          <Header
            /*  status={status} */
            /* dataSourceId={dataSourceId} */
            dataSourceName={activeDataSource?.name}
            git={activeDataSource?.git}
            storage={activeDataSource?.storage}
          />
          <Body
            goTo={goTo}
            mode={mode}
            snapshotName={snapshotName}
            dataSource={activeDataSource}
          />
        </>
      )}
      {/*  isReady ? (
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
          ) : null */}
    </Drawer>
  );
};

export default EditDrawer;
