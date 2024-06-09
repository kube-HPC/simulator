import { LOCAL_STORAGE_KEYS } from 'const';
/* eslint-disable import/no-cycle */
import { useActions, useLocalStorage } from 'hooks';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { stringify } from 'utils';

const useSettings = () => {
  const settings = useSelector(selectors.settings);
  const { setSettings } = useActions();

  useLocalStorage({
    value: stringify(settings),
    key: LOCAL_STORAGE_KEYS.SETTINGS,
  });

  return { ...settings, setSettings };
};

export default useSettings;
