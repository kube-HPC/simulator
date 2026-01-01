import gql from 'graphql-tag';

const PREFERRED_LIST = gql`
  query PreferedList(
    $pageSize: Int!
    $firstJobId: String
    $lastJobId: String
    $pipelineName: String
    $tag: String
    $lastJobs: Boolean
  ) {
    preferedList(
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

export default PREFERRED_LIST;
