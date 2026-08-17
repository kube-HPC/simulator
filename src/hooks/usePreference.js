import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from 'reducers';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';

const usePreference = (section, key) => {
  const dispatch = useDispatch();
  const sectionData = useSelector(
    state => selectors.preferences(state).data[section]
  );
  const value = key !== undefined ? sectionData?.[key] : sectionData;

  const setValue = useCallback(
    newValue => {
      if (key !== undefined) {
        dispatch(
          updatePreferenceLocal({ section, value: { [key]: newValue } })
        );
      } else {
        dispatch(updatePreferenceLocal({ section, value: newValue }));
      }
    },
    [dispatch, section, key]
  );

  return [value, setValue];
};

export default usePreference;
