import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

export const OVERVIEW_TABS = {
  INFO: 'Information',
  DESCRIPTION: 'Description',
  VERSIONS: 'Versions',
};

export default () => {
  const { pipelineId, tabKey } = useParams();
  const navigate = useNavigate();
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
        navigate({
          pathname: paths.root,
          search: location.search,
        }),
      overview: ({
        nextPipelineId = pipelineId,
        nextTabKey = OVERVIEW_TABS.INFO,
      } = {}) =>
        navigate({
          pathname: paths.overview({ nextPipelineId, nextTabKey }),
          search: location.search,
        }),
      edit: ({ nextPipelineId = pipelineId } = {}) =>
        navigate({
          pathname: paths.edit({ nextPipelineId }),
          search: location.search,
        }),
      execute: ({ nextPipelineId = pipelineId } = {}) =>
        navigate({
          pathname: paths.execute({ nextPipelineId }),
          search: location.search,
        }),
    }),
    [navigate, paths, pipelineId, location]
  );

  return {
    pipelineId,
    tabKey,
    goTo,
    paths,
  };
};
