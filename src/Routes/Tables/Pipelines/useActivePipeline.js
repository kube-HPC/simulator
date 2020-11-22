// import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// import { tableFilterSelector } from 'utils/tableSelector';
// import { LEFT_SIDEBAR_NAMES } from 'const';
import { selectors } from 'reducers/pipeline.reducer';
import usePath from './usePath';

// const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

export default () => {
  const { pipelineId } = usePath();
  const pipeline = useSelector(state =>
    selectors.collection.byId(state, pipelineId)
  );

  // const pipeline = useMemo(
  //   () => dataSource.find(item => item.name === pipelineId),
  //   [dataSource, pipelineId]
  // );

  return { pipeline, pipelineId };
};
