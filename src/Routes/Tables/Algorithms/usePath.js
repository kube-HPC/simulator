import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router';

export const OVERVIEW_TABS = {
  VERSIONS: 'Versions',
  BUILDS: 'Builds',
  INFO: 'Information',
  DESCRIPTION: 'Description',
};

export default () => {
  const { algorithmId, tabKey } = useParams();
  const history = useHistory();

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
      root: () => history.push(paths.root),
      overview: ({
        nextAlgorithmId = algorithmId,
        nextTabKey = OVERVIEW_TABS.VERSIONS,
      } = {}) => history.push(paths.overview({ nextAlgorithmId, nextTabKey })),
      edit: ({ nextAlgorithmId = algorithmId } = {}) =>
        history.push(paths.edit({ nextAlgorithmId })),
    }),
    [history, paths, algorithmId]
  );

  return {
    algorithmId,
    goTo,
    paths,
    tabKey,
  };
};
