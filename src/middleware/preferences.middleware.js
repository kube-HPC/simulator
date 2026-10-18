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
const THEME_RELOAD_AFTER_SAVE_FLAG = 'hkubeThemeReloadAfterSave';

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
        reloadTarget: sessionStorage.getItem(THEME_RELOAD_FLAG) ?? '(not set)',
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
          const reloadTarget = sessionStorage.getItem(THEME_RELOAD_FLAG);
          if (currentTheme !== serverPrefs.theme) {
            if (reloadTarget !== serverPrefs.theme) {
              console.warn(
                '[preferences] theme mismatch; reloading once to apply server theme',
                {
                  storedTheme: currentTheme ?? '(not set)',
                  serverTheme: serverPrefs.theme,
                }
              );
              sessionStorage.setItem(THEME_RELOAD_FLAG, serverPrefs.theme);
              window.location.reload();
              return result;
            }
            console.error(
              '[preferences] theme mismatch remains; reload skipped because this target was already applied',
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
      const { section, value, reloadAfterSave } = action.payload;
      syncToLocalStorage(section, value);
      if (section === 'theme' && reloadAfterSave) {
        sessionStorage.removeItem(THEME_RELOAD_FLAG);
      }

      // Auto-save theme and scoop interval; skip until prefs are loaded to avoid
      // overwriting saved data before fetchPreferences has run.
      if (AUTO_SAVE_SECTIONS.has(section)) {
        const { data, lastSavedTables, loaded } = getState().preferences;
        if (loaded) {
          if (section === 'theme' && reloadAfterSave) {
            sessionStorage.setItem(THEME_RELOAD_AFTER_SAVE_FLAG, value);
          }
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

    if (
      action.type === `${AT.PREFERENCES_SAVE}_SUCCESS` &&
      sessionStorage.getItem(THEME_RELOAD_AFTER_SAVE_FLAG)
    ) {
      const currentTheme = getState().preferences.data.theme;
      const expectedTheme = sessionStorage.getItem(
        THEME_RELOAD_AFTER_SAVE_FLAG
      );
      const savedTheme = action.payload?.theme ?? currentTheme;
      if (savedTheme === expectedTheme && currentTheme === expectedTheme) {
        sessionStorage.removeItem(THEME_RELOAD_AFTER_SAVE_FLAG);
        sessionStorage.setItem(THEME_RELOAD_FLAG, expectedTheme);
        console.info('[preferences] saved theme; reloading to apply', {
          theme: expectedTheme,
        });
        window.location.reload();
      }
    }

    if (
      action.type === `${AT.PREFERENCES_SAVE}_REJECT` &&
      sessionStorage.getItem(THEME_RELOAD_AFTER_SAVE_FLAG)
    ) {
      sessionStorage.removeItem(THEME_RELOAD_AFTER_SAVE_FLAG);
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
      console.warn('[page-reload] preferences reset completed', {
        targetTheme: PREFERENCES_DEFAULTS.theme,
        href: window.location.href,
      });
      window.location.reload();
    }

    return result;
  };

export default preferencesMiddleware;
