import { JOB_BY_ID_QUERY } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

const useJobById = JobsIds => {
  const [getJobsByID] = useLazyQuery(JOB_BY_ID_QUERY, {
    variables: {
      name: JobsIds,
    },
  });

  return {
    getJobsByID,
  };
};
export default useJobById;
