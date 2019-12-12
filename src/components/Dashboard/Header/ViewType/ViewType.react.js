import React from 'react';
import { IconCardView, IconListView } from 'components/Icons';
import { Icons } from 'components/common';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { useActions } from 'hooks';

const ViewType = () => {
  const { isTableView } = useSelector(state => state[STATE_SOURCES.VIEW_TYPE]);
  const { toggleViewType } = useActions();
  return (
    <Icons.Hover onClick={toggleViewType} component={isTableView ? IconCardView : IconListView} />
  );
};

export default ViewType;
