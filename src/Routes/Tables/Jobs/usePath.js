import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { OVERVIEW_JOB_TABS } from 'const';

export default () => {
  const { jobId, tabKey } = useParams();
  const navigate = useNavigate();
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
      root: () => navigate({ pathname: paths.root, search: location.search }),
      overview: ({
        nextJobId = jobId,
        nextTabKey = OVERVIEW_JOB_TABS.GRAPH,
      } = {}) =>
        navigate({
          pathname: paths.overview({ nextJobId, nextTabKey }),
          search: location.search,
        }),
    }),
    [navigate, paths, jobId, location]
  );

  return {
    jobId,
    tabKey,
    goTo,
    paths,
  };
};
