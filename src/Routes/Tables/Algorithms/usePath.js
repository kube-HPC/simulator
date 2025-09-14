import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { OVERVIEW_TABS } from 'const';

export default () => {
  const { algorithmId, tabKey } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const paths = useMemo(
    () => ({
      root: window.location.href.includes('marketplace')
        ? '/marketplace'
        : '/algorithms',
      overview: ({
        nextAlgorithmId = algorithmId,
        nextTabKey = OVERVIEW_TABS.VERSIONS,
      } = {}) =>
        `/${window.location.href.includes('marketplace') ? 'marketplace' : 'algorithms'}/${nextAlgorithmId}/overview/${nextTabKey}`,
      edit: ({ nextAlgorithmId = algorithmId } = {}) =>
        `/${window.location.href.includes('marketplace') ? 'marketplace' : 'algorithms'}/${nextAlgorithmId}/edit`,
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
      edit: ({ nextAlgorithmId = algorithmId } = {}) =>
        navigate({
          pathname: paths.edit({ nextAlgorithmId }),
          search: location.search,
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
