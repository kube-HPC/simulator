import AT from 'const/application-actions';
import { LOCAL_STORAGE_KEYS } from 'const';
import {
  PREFERENCES_DEFAULTS,
  updatePreferenceLocal,
} from 'reducers/preferences.reducer';
import { savePreferences } from 'actions/preferences.action';

const AUTO_SAVE_SECTIONS = new Set(['theme', 'scoopIntervalHours']);

const migrateFromLocalStorage = () => {
  const migrated = {};

  const theme = localStorage.getItem(
    LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME
  );
  if (theme) {
    migrated.theme = theme;
  }

  const scoopHours = parseInt(
    localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME),
    10
  );
  if (scoopHours && !Number.isNaN(scoopHours)) {
    migrated.scoopIntervalHours = scoopHours;
  }

  return migrated;
};

const syncToLocalStorage = (section, value) => {
  if (section === 'theme') {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME, value);
  }
  if (section === 'scoopIntervalHours') {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME,
      String(value)
    );
  }
};

const preferencesMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => {
    const result = next(action);

    // On first fetch, if server has no preferences, migrate from localStorage
    if (action.type === `${AT.PREFERENCES_FETCH}_SUCCESS`) {
      const serverPrefs = action.payload;
      if (!serverPrefs || Object.keys(serverPrefs).length === 0) {
        const migrated = migrateFromLocalStorage();
        if (migrated.theme) {
          dispatch(
            updatePreferenceLocal({ section: 'theme', value: migrated.theme })
          );
        }
        if (migrated.scoopIntervalHours) {
          dispatch(
            updatePreferenceLocal({
              section: 'scoopIntervalHours',
              value: migrated.scoopIntervalHours,
            })
          );
        }
      } else {
        // Sync server values to localStorage for offline fallback
        if (serverPrefs.theme) {
          syncToLocalStorage('theme', serverPrefs.theme);
        }
        if (serverPrefs.scoopIntervalHours) {
          syncToLocalStorage(
            'scoopIntervalHours',
            serverPrefs.scoopIntervalHours
          );
        }
      }
    }

    // On local preference updates, sync to localStorage as fallback
    if (action.type === updatePreferenceLocal.type) {
      const { section, value } = action.payload;
      syncToLocalStorage(section, value);

      // Auto-save theme and scoop interval to server immediately
      // Use lastSavedTables so pending column changes aren't persisted
      if (AUTO_SAVE_SECTIONS.has(section)) {
        const { data, lastSavedTables } = getState().preferences;
        dispatch(
          savePreferences({
            theme: data.theme,
            scoopIntervalHours: data.scoopIntervalHours,
            tables: lastSavedTables,
          })
        );
      }
    }

    // On reset success, restore localStorage to defaults
    if (action.type === `${AT.PREFERENCES_RESET}_SUCCESS`) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME,
        PREFERENCES_DEFAULTS.theme
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME,
        String(PREFERENCES_DEFAULTS.scoopIntervalHours)
      );
    }

    return result;
  };

export default preferencesMiddleware;
