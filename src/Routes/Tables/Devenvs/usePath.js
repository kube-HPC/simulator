import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

export default () => {
  const { name } = useParams();
  const history = useHistory();
  const location = useLocation();

  const paths = useMemo(
    () => ({
      root: '/devenvs',
    }),
    []
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({
          pathname: paths.root,
          search: location.search,
        }),
    }),
    [history, paths, location.search]
  );

  return {
    name,
    goTo,
    paths,
  };
};
