import { createStore } from 'reusable';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { useMemo } from 'react';
import useActions from './useActions';

const useLogs = () => {
  const { getKubernetesLogsData } = useActions();

  const logs = useSelector(selectors.jobs.logs);
  const _logs = useMemo(() => logs.map((value, key) => ({ key, ...value })), [
    logs,
  ]);

  return { logs: _logs, getLogs: getKubernetesLogsData };
};

export default createStore(useLogs);
