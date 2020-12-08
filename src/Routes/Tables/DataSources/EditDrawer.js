import React, { useCallback, useMemo, useRef } from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import { useDispatch } from 'react-redux';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import usePath from './usePath';
import useActiveDataSource from './useActiveDataSource';
import FileBrowser from './FileBrowser';
// import dummyFilesList from './filesList.dummy.json';

const EditDrawer = () => {
  const { goTo, dataSourceId } = usePath();
  const { dataSource, isReady, status } = useActiveDataSource();
  const { setOff, isOn } = useToggle(true);
  const ref = useRef();
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (!ref.current) return;
    dispatch(
      postVersion(
        {
          dataSourceName: dataSource.name,
          files: [],
          droppedFileIds: ref.current.getDeleteFiles(),
          mapping: ref.current.ls(),
          versionDescription: 'new version from the ui',
        },
        {
          onSuccess: nextDataSource => {
            if (nextDataSource === 'OK') {
              notification({ message: 'no changes were made', type: 'info' });
            }
            goTo.edit({ nextDataSourceId: nextDataSource.id });
          },
        }
      )
    );
  }, [ref, dataSource, dispatch, goTo]);

  const files = dataSource?.files ?? [];
  const header = useMemo(() => {
    switch (status) {
      case 'NOT_FOUND':
        return `could not find dataSource id: ${dataSourceId}`;
      case 'SUCCESS':
        return dataSource.name;
      case 'PENDING':
        return 'loading...';
      case 'FAIL':
        return `failed fetching dataSource id: ${dataSourceId}`;
      default:
        return '';
    }
  }, [status, dataSource, dataSourceId]);
  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.EDIT_DATASOURCE}>
      <h1>{header}</h1>
      <button onClick={onSubmit} type="button">
        click!
      </button>
      <div>{isReady ? <FileBrowser files={files} ref={ref} /> : null}</div>
    </Drawer>
  );
};

export default EditDrawer;
