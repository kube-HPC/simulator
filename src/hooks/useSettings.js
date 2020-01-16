import { LOCAL_STORAGE_KEYS, STATE_SOURCES } from 'const';
import { useActions, useLocalStorage } from 'hooks';
import { useSelector } from 'react-redux';
import { stringify } from 'utils';

const useSettings = () => {
  const settings = useSelector(state => state[STATE_SOURCES.SETTINGS]);
  const { setSettings } = useActions();

  useLocalStorage({ value: stringify(settings), key: LOCAL_STORAGE_KEYS.SETTINGS });

  return { ...settings, setSettings };
};

export default useSettings;
