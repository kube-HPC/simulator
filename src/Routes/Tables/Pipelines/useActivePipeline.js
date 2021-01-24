import { useSelector } from 'react-redux';
import { selectors } from 'reducers/pipeline.reducer';
import usePath from './usePath';

export default () => {
  const { pipelineId } = usePath();
  const pipeline = useSelector(state =>
    selectors.collection.byId(state, pipelineId)
  );

  return { pipeline, pipelineId };
};
