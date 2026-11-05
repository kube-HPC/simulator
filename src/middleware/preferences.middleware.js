import AT from 'const/application-actions';
import { LOCAL_STORAGE_KEYS } from 'const';
import dayjs from 'dayjs';
import {
  PREFERENCES_DEFAULTS,
  updatePreferenceLocal,
} from 'reducers/preferences.reducer';
import { savePreferences } from 'actions/preferences.action';
import { dateTimeDefaultVar } from 'cache';

const AUTO_SAVE_SECTIONS = new Set(['theme', 'scoopIntervalHours']);
let pendingThemeSave = null;

const normalizeTheme = theme => {
  const normalizedTheme = String(theme ?? '')
    .replace(/[-_\s]/g, '')
    .toUpperCase();

  if (normalizedTheme === 'LIGHTSOUT') {
    return 'lightsOut';
  }
  if (normalizedTheme === 'LIGHT') {
    return 'light';
  }
  return theme;
};

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
          const currentTheme = localStorage.getItem(
            LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME
          );
          const serverTheme = normalizeTheme(serverPrefs.theme);
          syncToLocalStorage('theme', serverTheme);
          const themeChanged =
            currentTheme === null
              ? serverTheme !== PREFERENCES_DEFAULTS.theme
              : currentTheme !== serverTheme;
          if (themeChanged && !pendingThemeSave) {
            window.location.reload();
          }
        }
        if (serverPrefs.scoopIntervalHours) {
          syncToLocalStorage(
            'scoopIntervalHours',
            serverPrefs.scoopIntervalHours
          );
        }
      }

      if (pendingThemeSave) {
        const { value, onSuccess } = pendingThemeSave;
        pendingThemeSave = null;
        dispatch({
          ...updatePreferenceLocal({ section: 'theme', value }),
          meta: { onSuccess },
        });
      }
    }

    // On local preference updates, sync to localStorage as fallback
    if (action.type === updatePreferenceLocal.type) {
      const { section, value } = action.payload;
      syncToLocalStorage(section, value);

      // Auto-save theme and scoop interval; skip until prefs are loaded to avoid
      // overwriting saved data before fetchPreferences has run.
      if (AUTO_SAVE_SECTIONS.has(section)) {
        const { data, lastSavedTables, loaded } = getState().preferences;
        if (loaded) {
          dispatch(
            savePreferences(
              {
                theme: data.theme,
                scoopIntervalHours: data.scoopIntervalHours,
                tables: lastSavedTables,
              },
              action.meta?.onSuccess
            )
          );
        } else if (section === 'theme' && action.meta?.onSuccess) {
          pendingThemeSave = { value, onSuccess: action.meta.onSuccess };
        }
      }
    }

    // On reset success, restore localStorage and reactive vars to defaults
    if (action.type === `${AT.PREFERENCES_RESET}_SUCCESS`) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME,
        PREFERENCES_DEFAULTS.theme
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME,
        String(PREFERENCES_DEFAULTS.scoopIntervalHours)
      );
      dateTimeDefaultVar({
        hour: PREFERENCES_DEFAULTS.scoopIntervalHours,
        time: dayjs().add(-PREFERENCES_DEFAULTS.scoopIntervalHours, 'hour'),
      });
    }

    return result;
  };

export default preferencesMiddleware;
