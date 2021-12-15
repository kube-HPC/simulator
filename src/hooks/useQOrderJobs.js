import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createStore } from 'reusable';
import useQOrderJobsFilters from 'hooks/useQOrderJobsFilters';
import { jobColumns } from 'Routes/Tables/Jobs';
import { selectors } from 'reducers';
import lodash from 'lodash';
import priorityType from 'const/priority';

const searchableKeys = ['key', 'pipeline.name'];

const useQOrderJobs = () => {
  const collection = useSelector(selectors.jobs.all);
  const searchFilter = useSelector(selectors.autoCompleteFilter);
  const { filters } = useQOrderJobsFilters('qTypesFilter');
  const { filters: priorityFilter } = useQOrderJobsFilters('qPriorityFilter');

  const filtered = useMemo(() => {
    if (
      searchFilter === '' &&
      filters.length === 0 &&
      priorityFilter.length === 0
    )
      return collection;

    return collection.filter(item => {
      // custom filter instead of useSearch to avoid looping the array twice
      if (
        searchFilter !== '' &&
        !searchableKeys.some(key =>
          lodash.get(item, key, '').includes(searchFilter)
        )
      ) {
        return false;
      }
      if (filters.length === 0 && priorityFilter.length === 0) return true;
      // avoid running through the tags if there aren't enough anyway
      if (
        item.pipeline.types.length < filters.length &&
        item.pipeline.priority.length < priorityFilter.length
      )
        return false;
      return (
        (filters.length === 0 ||
          filters.some(tag => item.pipeline.types.includes(tag))) &&
        (priorityFilter.length === 0 ||
          priorityFilter.some(
            tag => priorityType[item.pipeline.priority] === tag
          ))
      );
    });
  }, [searchFilter, filters, collection, priorityFilter]);

  const loading = useSelector(selectors.experiments.loadingState);
  return {
    dataSource: filtered,
    columns: jobColumns,
    loading,
  };
};

export default createStore(useQOrderJobs);
