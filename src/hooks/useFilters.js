import { useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const useFilters = () => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const filters = useMemo(() => query.getAll('filter'), [query]);

  const applyFilters = useCallback(
    () => history.push(`${pathname}?${query.toString()}`),
    [query, history, pathname]
  );

  const addFilter = useCallback(
    value => {
      query.append('filter', value);
      return applyFilters();
    },
    [query, applyFilters]
  );

  const dropFilter = useCallback(
    value => {
      const nextFilters = filters.filter(item => item !== value);
      query.delete('filter');
      nextFilters.forEach(f => query.append('filter', f));
      return applyFilters();
    },
    [query, applyFilters, filters]
  );

  const toggleFilter = useCallback(
    value => {
      filters.includes(value) ? dropFilter(value) : addFilter(value);
    },
    [filters, addFilter, dropFilter]
  );

  const setFilters = useCallback(
    nextFilters => {
      query.delete('filter');
      nextFilters.forEach(f => query.append('filter', f));
      return applyFilters();
    },
    [query, applyFilters]
  );

  return {
    filters,
    toggleFilter,
    addFilter,
    dropFilter,
    setFilters,
  };
};

export default useFilters;
