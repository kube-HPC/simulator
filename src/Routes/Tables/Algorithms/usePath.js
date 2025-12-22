import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { OVERVIEW_TABS } from 'const';

export default () => {
  const { algorithmId, tabKey } = useParams();
  const navigate = useNavigate();
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
      root: () => navigate({ pathname: paths.root, search: location.search }),
      overview: ({
        nextAlgorithmId = algorithmId,
        nextTabKey = OVERVIEW_TABS.VERSIONS,
      } = {}) =>
        navigate({
          pathname: paths.overview({ nextAlgorithmId, nextTabKey }),
          search: location.search,
        }),
      edit: ({ nextAlgorithmId = algorithmId, openAdvanced = false } = {}) =>
        navigate({
          pathname: paths.edit({ nextAlgorithmId }),
          search: openAdvanced ? '?section=advanced' : location.search,
        }),
    }),
    [navigate, paths, algorithmId, location]
  );

  return {
    algorithmId,
    goTo,
    paths,
    tabKey,
  };
};
