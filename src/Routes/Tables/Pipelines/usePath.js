import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router';

export const OVERVIEW_TABS = {
  INFO: 'information',
  DESCRIPTION: 'description',
};

export default () => {
  const { pipelineId, tabKey } = useParams();
  const history = useHistory();

  const paths = useMemo(
    () => ({
      root: '/pipelines',
      overview: ({
        nextPipelineId = pipelineId,
        nextTabKey = OVERVIEW_TABS.INFO,
      } = {}) => `/pipelines/${nextPipelineId}/overview/${nextTabKey}`,
      edit: ({ nextPipelineId = pipelineId } = {}) =>
        `/pipelines/${nextPipelineId}/edit`,
    }),
    [pipelineId]
  );

  const goTo = useMemo(
    () => ({
      root: () => history.push(paths.root),
      overview: ({
        nextPipelineId = pipelineId,
        nextTabKey = OVERVIEW_TABS.INFO,
      } = {}) => history.push(paths.overview({ nextPipelineId, nextTabKey })),
      edit: ({ nextPipelineId = pipelineId } = {}) =>
        history.push(paths.edit({ nextPipelineId })),
    }),
    [history, paths, pipelineId]
  );

  return {
    pipelineId,
    tabKey,
    goTo,
    paths,
  };
};
