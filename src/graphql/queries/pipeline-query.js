import { gql } from '@apollo/client';

const PIPELINE_QUERY = gql`
  query Pipelines {
    pipelines {
      list
      pipelinesCount
    }
  }
`;

export default PIPELINE_QUERY;
