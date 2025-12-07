import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hideableTables';

export const useTableState = (tableId, columns) => {
  const savedAll = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const savedState = savedAll[tableId] || {};

  const initialVisible = columns.map(c => c.key || c.dataIndex);

  const [visibleColumns, setVisibleColumns] = useState(
    savedState.visibleColumns || initialVisible
  );
  const [colWidths, setColWidths] = useState(savedState.colWidths || {});
  const [isChange, setIsChange] = useState(savedState.isChange || false);

  const saveState = (newVisible, newWidths, change = true) => {
    const allTables = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allTables[tableId] = {
      colWidths: newWidths ?? colWidths,
      visibleColumns: newVisible ?? visibleColumns,
      isChange: change,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTables));
    setIsChange(change);
  };

  const toggleColumn = key => {
    const col = columns.find(c => (c.key || c.dataIndex) === key);
    if (col.must) return;

    setVisibleColumns(prev => {
      const newVisible = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key];
      saveState(newVisible, colWidths, true);
      return newVisible;
    });
  };

  const measureWidths = (isReset = false) => {
    const ths = document.querySelectorAll(`th[data-key]`);
    const newWidths = {};
    ths.forEach(th => {
      const key = th.getAttribute('data-key');
      if (key) newWidths[key] = th.offsetWidth;
    });
    setColWidths(newWidths);
    saveState(visibleColumns, newWidths, !isReset);
  };

  const updateColumnWidth = (key, width) => {
    setColWidths(prev => {
      const newWidths = { ...prev, [key]: width };
      saveState(visibleColumns, newWidths, true);
      return newWidths;
    });
  };

  const resetTable = () => {
    setVisibleColumns(initialVisible);
    setColWidths({});
    const allTables = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    allTables[tableId] = {
      colWidths: {},
      visibleColumns: initialVisible,
      isChange: false,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTables));
    setIsChange(false);

    setTimeout(() => measureWidths(true), 0);
  };

  useEffect(() => {
    measureWidths();
    window.addEventListener('resize', measureWidths);
    return () => window.removeEventListener('resize', measureWidths);
  }, [visibleColumns, tableId]);

  return {
    visibleColumns,
    colWidths,
    isChange,
    toggleColumn,
    updateColumnWidth,
    resetTable,
    initialVisible,
  };
};
