import React, { useMemo } from 'react';
import { IconCardView, IconListView } from 'components/Icons';
import { Icons } from 'components/common';
import useQuery from 'hooks/useQuery';
import { Link, useLocation } from 'react-router-dom';

const ViewType = () => {
  const query = useQuery();
  const isGridView = useMemo(() => query.get('view'), [query]);
  const location = useLocation();
  const nextPath = useMemo(() => {
    if (isGridView) return `${location.pathname}`;
    return `${location.pathname}?view=grid`;
  }, [location, isGridView]);

  return (
    <Link to={nextPath}>
      <Icons.Hover component={isGridView ? IconListView : IconCardView} />
    </Link>
  );
};

export default ViewType;
