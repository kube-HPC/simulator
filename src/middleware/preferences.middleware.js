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
const THEME_RELOAD_FLAG = 'hkubePreferencesThemeReload';

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
      console.info('[preferences] fetched', {
        serverTheme: serverPrefs?.theme ?? '(not set)',
        storedTheme:
          localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME) ??
          '(not set)',
        reloadGuard: sessionStorage.getItem(THEME_RELOAD_FLAG) === 'true',
      });
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
          syncToLocalStorage('theme', serverPrefs.theme);
          // Theme styles are read from localStorage at startup, so a reload is needed to apply it
          if (currentTheme === serverPrefs.theme) {
            if (sessionStorage.getItem(THEME_RELOAD_FLAG)) {
              console.info(
                '[preferences] theme matches server; clearing reload guard'
              );
              sessionStorage.removeItem(THEME_RELOAD_FLAG);
            }
          } else if (!sessionStorage.getItem(THEME_RELOAD_FLAG)) {
            console.warn(
              '[preferences] theme mismatch; reloading once to apply server theme',
              {
                storedTheme: currentTheme ?? '(not set)',
                serverTheme: serverPrefs.theme,
              }
            );
            sessionStorage.setItem(THEME_RELOAD_FLAG, 'true');
            window.location.reload();
            return result;
          } else {
            console.error(
              '[preferences] theme mismatch remains; reload skipped because guard is set',
              {
                storedTheme: currentTheme ?? '(not set)',
                serverTheme: serverPrefs.theme,
              }
            );
          }
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

      // Auto-save theme and scoop interval; skip until prefs are loaded to avoid
      // overwriting saved data before fetchPreferences has run.
      if (AUTO_SAVE_SECTIONS.has(section)) {
        const { data, lastSavedTables, loaded } = getState().preferences;
        if (loaded) {
          dispatch(
            savePreferences({
              theme: data.theme,
              scoopIntervalHours: data.scoopIntervalHours,
              tables: lastSavedTables,
            })
          );
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
      window.location.reload();
    }

    return result;
  };

export default preferencesMiddleware;
