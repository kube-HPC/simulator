import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';

const useQOrderJobFilters = filterName => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const filters = useMemo(() => query.getAll(filterName), [filterName, query]);

  const applyFilters = useCallback(
    () => history.push(`${pathname}?${query.toString()}`),
    [query, history, pathname]
  );

  const addFilter = useCallback(
    value => {
      query.append(filterName, value);
      return applyFilters();
    },
    [query, filterName, applyFilters]
  );

  const dropFilter = useCallback(
    value => {
      const nextFilters = filters.filter(item => item !== value);
      query.delete(filterName);
      nextFilters.forEach(f => query.append(filterName, f));
      return applyFilters();
    },
    [filters, query, filterName, applyFilters]
  );

  const toggleFilter = useCallback(
    value => {
      filters.includes(value) ? dropFilter(value) : addFilter(value);
    },
    [filters, addFilter, dropFilter]
  );

  const setFilters = useCallback(
    nextFilters => {
      query.delete(filterName);
      nextFilters.forEach(f => query.append(filterName, f));
      return applyFilters();
    },
    [query, filterName, applyFilters]
  );

  return {
    filters,
    setFilters,
    toggleFilter,
    addFilter,
    dropFilter,
  };
};

useQOrderJobFilters.propTypes = {
  filterName: PropTypes.string,
};

useQOrderJobFilters.defaultProps = {
  filterName: 'filter',
};

export default useQOrderJobFilters;
