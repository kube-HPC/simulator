import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

export default function useConnectionStatus() {
  const { hasData, isSocketConnected } = useSelector(
    selectors.connection.stats
  );
  return { isDataAvailable: hasData, isSocketConnected };
}
