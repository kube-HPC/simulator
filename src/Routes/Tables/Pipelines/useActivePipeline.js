import { PIPELINE_QUERY } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import usePath from './usePath';

export default () => {
  const { pipelineId } = usePath();

  const query = useQuery(PIPELINE_QUERY);
  const pipeline = query.data?.pipelines?.list.find(x => x.name === pipelineId);

  return { pipeline, pipelineId };
};
