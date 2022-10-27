import { useEffect, useState } from 'react';
import { DATASOURCE_BY_ID_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
import _ from 'lodash';
// import sum from 'hash-sum';

const useActiveDataSource = (dataSourceName, dataSourceId) => {
  const [activeDataSource, setActiveDataSource] = useState({});
  const query = useQuery(DATASOURCE_BY_ID_QUERY, {
    variables: {
      name: dataSourceName,
      dataSourceId,
    },
  });
  usePolling(query, 3000);

  useEffect(() => {
    const dsActiveDataSource = query?.data?.dataSource || {};

    if (dsActiveDataSource && !_.isEmpty(dsActiveDataSource)) {
      setActiveDataSource(dsActiveDataSource);
    }
  }, [query.data?.dataSource]);

  return {
    activeDataSource,
  };
};
export default useActiveDataSource;
