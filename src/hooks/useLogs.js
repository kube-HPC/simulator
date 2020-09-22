import { createStore } from 'reusable';
import { useSelector } from 'react-redux';
import useActions from './useActions';

const useLogs = () => {
  const { getKubernetesLogsData } = useActions();
  const logs = useSelector(state =>
    state.jobsKubernetesLogs.dataSource.map((value, key) => ({ key, ...value }))
  );

  return { logs, getLogs: getKubernetesLogsData };
};

export default createStore(useLogs);
