import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { OVERVIEW_TABS } from 'const';

export default () => {
  const { algorithmId, tabKey } = useParams();
  const history = useHistory();
  const location = useLocation();
  const paths = useMemo(
    () => ({
      root: '/algorithms',
      overview: ({
        nextAlgorithmId = algorithmId,
        nextTabKey = OVERVIEW_TABS.VERSIONS,
      } = {}) => `/algorithms/${nextAlgorithmId}/overview/${nextTabKey}`,
      edit: ({ nextAlgorithmId = algorithmId } = {}) =>
        `/algorithms/${nextAlgorithmId}/edit`,
    }),
    [algorithmId]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({ pathname: paths.root, search: location.search }),
      overview: ({
        nextAlgorithmId = algorithmId,
        nextTabKey = OVERVIEW_TABS.VERSIONS,
      } = {}) =>
        history.push({
          pathname: paths.overview({ nextAlgorithmId, nextTabKey }),
          search: location.search,
        }),
      edit: ({ nextAlgorithmId = algorithmId } = {}) =>
        history.push({
          pathname: paths.edit({ nextAlgorithmId }),
          search: location.search,
        }),
    }),
    [history, paths, algorithmId, location]
  );

  return {
    algorithmId,
    goTo,
    paths,
    tabKey,
  };
};
