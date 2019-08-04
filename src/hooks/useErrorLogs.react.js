import { useSelector } from 'react-redux';
import tableDataSelector from 'utils/tableDataSelector';
import { STATE_SOURCES } from 'reducers/root.reducer';

const dataSelector = tableDataSelector(
  STATE_SOURCES.ERROR_LOGS_TABLE,
  filter => record => record.serviceName.includes(filter)
);

export default function useErrorLogs() {
  const dataSource = useSelector(dataSelector);

  return {
    dataSource
  };
}
