import gql from 'graphql-tag';

const MANAGED_LIST_TAGS = gql`
  query AggregatedTagsManaged {
    aggregatedTagsManaged {
      name
      count
    }
  }
`;

export default MANAGED_LIST_TAGS;
