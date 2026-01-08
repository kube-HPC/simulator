import React, { useMemo, useEffect } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { SkeletonLoader, HKGrid } from 'components/common';
import { Route, Routes } from 'react-router-dom';

import { usePolling } from 'hooks';
import { useQuery, useReactiveVar, makeVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { ALGORITHMS_QUERY } from 'graphql/queries';

import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import EditDrawer from './EditDrawer';
import algorithmColumns from './columns';
import AlgorithmsQueryTable from './AlgorithmsQueryTable';

export const algorithmsListVar = makeVar([]);

const AlgorithmsTable = () => {
  const { goTo } = usePath();
  const instanceFilter = useReactiveVar(instanceFiltersVar);
  const { keycloakEnable } = useSelector(selectors.connection);

  const query = useQuery(ALGORITHMS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  usePolling(query, 3000);

  useEffect(() => {
    if (query.data?.algorithms?.list) {
      algorithmsListVar(query.data.algorithms.list);
    }
  }, [query.data]);

  const algorithmsList = useReactiveVar(algorithmsListVar);

  const rowData = useMemo(() => {
    const filterValue = instanceFilter.algorithms.qAlgorithmName;

    let list = [...algorithmsList];

    if (filterValue) {
      list = list.filter(item => item.name.includes(filterValue));
    }

    return list.sort((x, y) => {
      if (x.unscheduledReason && !y.unscheduledReason) return -1;
      if (!x.unscheduledReason && y.unscheduledReason) return 1;
      return x.modified < y.modified ? 1 : -1;
    });
  }, [instanceFilter.algorithms.qAlgorithmName, algorithmsList]);

  const columnDefs = useMemo(() => {
    if (!keycloakEnable) {
      return algorithmColumns.slice(1);
    }
    return algorithmColumns;
  }, [keycloakEnable]);

  if (!algorithmsList.length) return <SkeletonLoader />;
  if (query.error) return `Error! ${query.error.message}`;

  return (
    <>
      <AlgorithmsQueryTable
        algorithmsList={algorithmsList}
        onSubmit={() => {}}
      />

      <HKGrid
        rowData={rowData}
        columnDefs={columnDefs}
        onRowDoubleClicked={({ data }) =>
          goTo.overview({ nextAlgorithmId: data.name })
        }
      />

      <Routes>
        <Route
          path=":algorithmId/overview/:tabKey"
          element={<OverviewDrawer />}
        />
        <Route path=":algorithmId/edit" element={<EditDrawer />} />
      </Routes>
    </>
  );
};

export default React.memo(AlgorithmsTable);
