import gql from 'graphql-tag';

const EXPERIMENT_QUERY = gql`
  query Experiments {
    experiments {
      name
      description
      created
    }
  }
`;

export default EXPERIMENT_QUERY;
