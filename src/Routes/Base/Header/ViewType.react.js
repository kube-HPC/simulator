import React, { useMemo } from 'react';
import { Icons } from 'components/common';
import useQuery from 'hooks/useQuery';
import { Link, useLocation } from 'react-router-dom';
import { IconCardView, IconListView } from 'components/Icons';

const ViewType = () => {
  const query = useQuery();
  const isGridView = useMemo(() => query.get('view'), [query]);
  const location = useLocation();
  const nextPath = useMemo(() => {
    if (isGridView) {
      query.delete('view');
    } else {
      query.append('view', 'grid');
    }
    return `${location.pathname}?${query.toString()}`;
  }, [location, isGridView, query]);

  return (
    <Link to={nextPath}>
      <Icons.Hover component={isGridView ? IconListView : IconCardView} />
    </Link>
  );
};

export default ViewType;
