const { default: gql } = require('graphql-tag');

const DRIVERS_ALL_QUERY = gql`
  query PipelineDriver {
    discovery {
      pipelineDriver {
        driverId
        podName
        idle
        paused
        status
        max
        capacity
        jobs {
          jobId
          active
          pipelineName
        }
      }
    }
  }
`;

export default DRIVERS_ALL_QUERY;
