import React, { useCallback } from 'react';
import { IconCardView, IconListView } from 'components/Icons';
import { Icons } from 'components/common';
import { useViewType } from 'hooks';

const ViewType = () => {
  const { isTableView, toggleViewType, firstLoad, loadedOnce } = useViewType();
  const onClick = useCallback(e => {
    e.preventDefault();
    toggleViewType();
    if (!loadedOnce) {
      firstLoad();
    }
  }, []);
  return <Icons.Hover onClick={onClick} component={isTableView ? IconCardView : IconListView} />;
};

export default ViewType;
