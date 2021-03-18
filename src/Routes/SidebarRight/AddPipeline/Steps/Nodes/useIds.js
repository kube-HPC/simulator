import { useMemo, useState, useCallback } from 'react';

export default (initialState = []) => {
  const [ids, setCollection] = useState(
    Object.keys(initialState).map(x => parseInt(x, 10))
  );
  const latest = useMemo(() => (ids.length === 0 ? 0 : ids[ids.length - 1]), [
    ids,
  ]);

  const appendId = useCallback(
    () => setCollection(state => state.concat(latest + 1)),
    [setCollection, latest]
  );

  const dropId = useCallback(
    id => setCollection(state => state.filter(item => item !== id)),
    [setCollection]
  );

  return [ids, appendId, dropId];
};
