import React, { useCallback, useState } from 'react';
import { Route } from 'react-router-dom';
import { Table } from 'components';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { filterToggeledVar } from 'cache';
import { ALGORITHMS_QUERY } from 'graphql/queries';
import { Collapse } from 'react-collapse';

import algorithmColumns from './columns';
import usePath from './usePath';
import OverviewDrawer from './OverviewDrawer';
import EditDrawer from './EditDrawer';

import AlgorithmsQueryTable from './AlgorithmsQueryTable';

const rowKey = ({ name }) => name;

const AlgorithmsTable = () => {
  // const { collection } = useAlgorithm();
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const [algorithmsFilterList, setAlgorithmsFilterList] = useState([]);

  const { goTo } = usePath();
  const query = useQuery(ALGORITHMS_QUERY);
  usePolling(query, 10000);

  const onRow = ({ name }) => ({
    onDoubleClick: () => goTo.overview({ nextAlgorithmId: name }),
  });

  const onSubmitFilter = useCallback(values => {
    if (values.qAlgorithmName) {
      const filterPipeline = query.data?.algorithms?.list.filter(item =>
        item.name.includes(values.qAlgorithmName)
      );
      setAlgorithmsFilterList(filterPipeline);
    } else {
      setAlgorithmsFilterList(query.data?.algorithms?.list);
    }
  });

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <AlgorithmsQueryTable
          algorithmsList={query.data?.algorithms?.list}
          onSubmit={onSubmitFilter}
        />
      </Collapse>
      <Table
        onRow={onRow}
        rowKey={rowKey}
        columns={algorithmColumns}
        dataSource={algorithmsFilterList}
        expandIcon={false}
      />
      <Route
        exact
        path="/algorithms/:algorithmId/overview/:tabKey"
        component={OverviewDrawer}
      />
      <Route path="/algorithms/:algorithmId/edit" component={EditDrawer} />
    </>
  );
};

export default React.memo(AlgorithmsTable);
