const { default: gql } = require('graphql-tag');

const MANAGED_LIST = gql`
  query ManagedList(
    $pageSize: Int!
    $firstJobId: String
    $lastJobId: String
    $pipelineName: String
    $tag: String
    $lastJobs: Boolean
  ) {
    managedList(
      pageSize: $pageSize
      firstJobId: $firstJobId
      lastJobId: $lastJobId
      pipelineName: $pipelineName
      tag: $tag
      lastJobs: $lastJobs
    ) {
      nextCount
      prevCount
      returnList {
        jobId
        experimentName
        pipelineName
        priority
        maxExceeded
        entranceTime
        tags
      }
    }
  }
`;

export default MANAGED_LIST;
