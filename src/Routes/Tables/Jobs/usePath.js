import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router';

export const OVERVIEW_TABS = {
  GRAPH: 'graph',
  TRACE: 'trace',
  INFO: 'information',
};

export default () => {
  const { jobId, tabKey } = useParams();
  const history = useHistory();

  const paths = useMemo(
    () => ({
      root: '/jobs',
      overview: ({
        nextJobId = jobId,
        nextTabKey = OVERVIEW_TABS.GRAPH,
      } = {}) => `/jobs/${nextJobId}/overview/${nextTabKey}`,
    }),
    [jobId]
  );

  const goTo = useMemo(
    () => ({
      root: () => history.push(paths.root),
      overview: ({
        nextJobId = jobId,
        nextTabKey = OVERVIEW_TABS.GRAPH,
      } = {}) => history.push(paths.overview({ nextJobId, nextTabKey })),
    }),
    [history, paths, jobId]
  );

  return {
    jobId,
    tabKey,
    goTo,
    paths,
  };
};
