import { gql } from '@apollo/client';

const DISK_SPACE_QUERY = gql`
  query DiskSpace {
    diskSpace {
      size
      free
    }
  }
`;

export default DISK_SPACE_QUERY;
