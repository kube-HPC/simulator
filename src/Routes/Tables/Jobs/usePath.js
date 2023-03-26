import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { OVERVIEW_JOB_TABS } from 'const';

export default () => {
  const { jobId, tabKey } = useParams();
  const history = useHistory();
  const location = useLocation();

  const paths = useMemo(
    () => ({
      root: '/jobs',
      overview: ({
        nextJobId = jobId,
        nextTabKey = OVERVIEW_JOB_TABS.GRAPH,
      } = {}) => `/jobs/${nextJobId}/overview/${nextTabKey}`,
    }),
    [jobId]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({ pathname: paths.root, search: location.search }),
      overview: ({
        nextJobId = jobId,
        nextTabKey = OVERVIEW_JOB_TABS.GRAPH,
      } = {}) =>
        history.push({
          pathname: paths.overview({ nextJobId, nextTabKey }),
          search: location.search,
        }),
    }),
    [history, paths, jobId, location]
  );

  return {
    jobId,
    tabKey,
    goTo,
    paths,
  };
};
