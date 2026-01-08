import gql from 'graphql-tag';

const PREFERRED_LIST_TAGS = gql`
  query AggregatedTagsPrefered {
    aggregatedTagsPrefered {
      name
      count
      lastJob
    }
  }
`;

export default PREFERRED_LIST_TAGS;
