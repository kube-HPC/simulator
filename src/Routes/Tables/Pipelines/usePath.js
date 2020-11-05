import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

export const OVERVIEW_TABS = {
  INFO: 'information',
  DESCRIPTION: 'description',
};

export default () => {
  const { pipelineId, tabKey } = useParams();
  const history = useHistory();
  const location = useLocation();
  const paths = useMemo(
    () => ({
      root: '/pipelines',
      overview: ({
        nextPipelineId = pipelineId,
        nextTabKey = OVERVIEW_TABS.INFO,
      } = {}) => `/pipelines/${nextPipelineId}/overview/${nextTabKey}`,
      edit: ({ nextPipelineId = pipelineId } = {}) =>
        `/pipelines/${nextPipelineId}/edit`,
      execute: ({ nextPipelineId = pipelineId } = {}) =>
        `/pipelines/${nextPipelineId}/execute`,
    }),
    [pipelineId]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({
          pathname: paths.root,
          search: location.search,
        }),
      overview: ({
        nextPipelineId = pipelineId,
        nextTabKey = OVERVIEW_TABS.INFO,
      } = {}) =>
        history.push({
          pathname: paths.overview({ nextPipelineId, nextTabKey }),
          search: location.search,
        }),
      edit: ({ nextPipelineId = pipelineId } = {}) =>
        history.push({
          pathname: paths.edit({ nextPipelineId }),
          search: location.search,
        }),
      execute: ({ nextPipelineId = pipelineId } = {}) =>
        history.push({
          pathname: paths.execute({ nextPipelineId }),
          search: location.search,
        }),
    }),
    [history, paths, pipelineId, location]
  );

  return {
    pipelineId,
    tabKey,
    goTo,
    paths,
  };
};
