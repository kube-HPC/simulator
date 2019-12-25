import React from 'react';
import { IconCardView, IconListView } from 'components/Icons';
import { Icons } from 'components/common';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { useActions } from 'hooks';

const ViewType = () => {
  const { isTableView } = useSelector(state => state[STATE_SOURCES.VIEW_TYPE]);
  const { toggleViewType, firstLoad } = useActions();
  const onClick = e => {
    e.preventDefault();
    toggleViewType();
    firstLoad();
  };
  return <Icons.Hover onClick={onClick} component={isTableView ? IconCardView : IconListView} />;
};

export default ViewType;
