/**
 * Merges saved column preferences (visibility, width) into AG Grid column definitions.
 * Columns with `isPinning: true` are never modified — they stay visible always.
 * If no saved preference exists for a column, the original definition is used.
 */
const applyColumnPreferences = (columnDefs, savedColumns) => {
  if (!savedColumns || Object.keys(savedColumns).length === 0) {
    return columnDefs;
  }

  return columnDefs.map(col => {
    if (!col.field || col.isPinning) return col;
    const saved = savedColumns[col.field];
    if (!saved) return col;

    const merged = { ...col };
    if (saved.visible === false) {
      merged.hide = true;
    } else if (saved.visible === true) {
      merged.hide = false;
    }
    if (saved.width != null) {
      merged.width = saved.width;
      // Remove flex so the explicit width takes effect
      delete merged.flex;
    }
    return merged;
  });
};

export default applyColumnPreferences;
