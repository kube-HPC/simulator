import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createStore } from 'reusable';
import useFilters from 'hooks/useFilters';
import { jobColumns } from 'Routes/Tables/Jobs';
import { selectors } from 'reducers';

const useJobs = () => {
  const collection = useSelector(selectors.jobs.all);
  const searchFilter = useSelector(state => state.autoCompleteFilter.filter);
  const { filters } = useFilters();

  const filtered = useMemo(() => {
    if (searchFilter === '' && filters.length === 0) return collection;

    return collection.filter(item => {
      // instead of useSearch to avoid looping the array twice
      if (searchFilter !== '' && !item.key.includes(searchFilter)) return false;
      if (filters.length === 0) return true;
      // avoid running through the tags if there aren't enough anyway
      if (item.pipeline.types.length < filters.length) return false;
      return filters.every(tag => item.pipeline.types.includes(tag));
    });
  }, [collection, searchFilter, filters]);

  const loading = useSelector(selectors.experiments.loadingState);
  return {
    dataSource: filtered,
    columns: jobColumns,
    loading,
  };
};

export default createStore(useJobs);
