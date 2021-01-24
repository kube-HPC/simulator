import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

export default function useConnectionStatus() {
  const { hasData, isSocketConnected } = useSelector(selectors.connection);
  return { isDataAvailable: hasData, isSocketConnected };
}
