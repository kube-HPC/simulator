import cleanDeep from 'clean-deep';

// ----------------------------------------
// try parse json
// ----------------------------------------
export const tryParseJson = val => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

// ----------------------------------------
// deep copy from key value object
// ----------------------------------------
export const deepCopyFromKeyValue = (schemaObject, keyValueObject) => {
  if (typeof schemaObject !== 'object' || schemaObject === null)
    return schemaObject;

  let value;

  const outObject = Array.isArray(schemaObject) ? [] : {};

  Object.keys(schemaObject).forEach(key => {
    value = schemaObject[key];

    if (typeof value === 'object')
      outObject[key] = deepCopyFromKeyValue(value, keyValueObject);
    else if (keyValueObject[key]) outObject[key] = keyValueObject[key];
  });

  return outObject;
};

export const flattenObjKeyValue = obj =>
  obj &&
  Object.assign(
    {},
    ...(function _flatten(o) {
      return [].concat(
        ...Object.keys(o).map(k =>
          o[k] && typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
        )
      );
    })(obj)
  );

// ----------------------------------------
// clean deep remove key by path
// ----------------------------------------
export const isValuesFiltersEmpty = obj =>
  (obj &&
    Object.values((obj && obj) || {}).some(x =>
      typeof x === 'object'
        ? Object.values((x && x) || {}).some(y => y != null)
        : x != null
    )) ||
  false;

// ----------------------------------------
//
// ----------------------------------------
export const removeNullUndefined = obj =>
  obj &&
  Object.entries(obj)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

export const removeNullUndefinedCleanDeep = obj =>
  cleanDeep(obj, {
    emptyArrays: false,
    emptyObjects: false,
    emptyStrings: false,
    NaNValues: true,
  });

// ----------------------------------------
// merge two objects
// ----------------------------------------

export const mergeObjects = (obj1, obj2) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj1) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        mergeObjects(obj1[key], obj2[key]);
      } else {
        // eslint-disable-next-line no-prototype-builtins, no-param-reassign
        obj2[key] = obj1[key];
      }
    }
  }
  return obj2;
};

// ----------------------------------------
// transform fields to object
// ----------------------------------------
export const transformFieldsToObject = values => {
  if (!Array.isArray(values)) return {};

  return values.reduce((acc, item) => {
    if (item && typeof item === 'object') {
      const { key, value } = item;
      if (key && value !== undefined) {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};

// ----------------------------------------
// transform object to array of key value objects
// ----------------------------------------
export const transformObjectToArray = (obj = {}) =>
  obj && typeof obj === 'object'
    ? Object.entries(obj).map(([key, value]) => ({ key, value }))
    : [];

export const setTypeVolume = objVolumes => {
  if (!Array.isArray(objVolumes)) return [];

  return objVolumes.reduce((acc, obj) => {
    if (!obj || typeof obj !== 'object' || !obj.name) return acc;

    const typeVolume = obj.typeVolume || 'emptyDir';
    let valueOfType = obj[typeVolume];

    if (typeVolume === 'emptyDir') {
      if (valueOfType === '' || valueOfType === undefined) {
        valueOfType = {};
      }

      if (typeof valueOfType === 'string') {
        try {
          const parsed = JSON.parse(valueOfType);
          if (typeof parsed === 'object' && parsed !== null) {
            valueOfType = parsed;
          }
        } catch (error) {
          //
        }
      }
    }

    acc.push({ name: obj.name, [typeVolume]: valueOfType });
    return acc;
  }, []);
};

// ----------------------------------------
// clean deep remove key by path
// ----------------------------------------
function removeEmptyKeysByPath(obj, cleanKeysSet, currentPath = '') {
  if (Array.isArray(obj)) {
    return obj.map((item, index) =>
      removeEmptyKeysByPath(item, cleanKeysSet, `${currentPath}[${index}]`)
    );
  }

  if (obj !== null && typeof obj === 'object') {
    const result = {};

    Object.entries(obj).forEach(([key, value]) => {
      const path = currentPath ? `${currentPath}.${key}` : key;

      const cleanedValue = removeEmptyKeysByPath(value, cleanKeysSet, path);

      const isEmpty = value === null || value === undefined || value === '';

      const isEmptyObject =
        cleanedValue &&
        typeof cleanedValue === 'object' &&
        !Array.isArray(cleanedValue) &&
        Object.keys(cleanedValue).length === 0;

      if (cleanKeysSet.has(path) && (isEmpty || isEmptyObject)) {
        return;
      }

      result[key] = cleanedValue;
    });

    return result;
  }

  return obj;
}

export function cleanDeepAdvanced(obj, options = {}) {
  const { cleanKeys = [], ...cleanDeepOptions } = options;

  if (cleanKeys.length === 0) {
    return cleanDeep(obj, cleanDeepOptions);
  }

  const cleanKeysSet = new Set(cleanKeys);
  const afterKeysClean = removeEmptyKeysByPath(obj, cleanKeysSet);
  return cleanDeep(afterKeysClean, cleanDeepOptions);
}

// ----------------------------------------
// clean deep keep keys by path
// ----------------------------------------
function tokenizePath(path) {
  const tokens = [];
  const regex = /[^.[\]]+|\[(\d+)\]/g;
  let match = regex.exec(path);

  while (match) {
    const [raw, arrayIndex] = match;
    tokens.push(arrayIndex !== undefined ? Number(arrayIndex) : raw);
    match = regex.exec(path);
  }

  return tokens;
}

function collectObjectPaths(obj, currentPath = '', paths = []) {
  if (currentPath) {
    paths.push(currentPath);
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
      collectObjectPaths(item, path, paths);
    });
    return paths;
  }

  if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      const path = currentPath ? `${currentPath}.${key}` : key;
      collectObjectPaths(obj[key], path, paths);
    });
  }

  return paths;
}

function matchPathWithWildcard(path, pattern) {
  const pathTokens = tokenizePath(path);
  const patternTokens = tokenizePath(pattern);

  if (patternTokens.length === 0) {
    return pathTokens.length === 0;
  }

  let pathIdx = 0;

  for (let patternIdx = 0; patternIdx < patternTokens.length; patternIdx += 1) {
    const token = patternTokens[patternIdx];
    const isLastPatternToken = patternIdx === patternTokens.length - 1;

    if (token === '*') {
      // trailing wildcard means "any depth below current path"
      if (isLastPatternToken) {
        return pathIdx < pathTokens.length;
      }

      if (pathIdx >= pathTokens.length) {
        return false;
      }

      pathIdx += 1;
    } else if (pathIdx >= pathTokens.length || token !== pathTokens[pathIdx]) {
      return false;
    } else {
      pathIdx += 1;
    }
  }

  return pathIdx === pathTokens.length;
}

function getPathState(obj, path) {
  const tokens = tokenizePath(path);
  if (tokens.length === 0) {
    return { exists: true, value: obj };
  }

  let current = obj;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (current === null || typeof current !== 'object') {
      return { exists: false, value: undefined };
    }

    if (!Object.prototype.hasOwnProperty.call(current, token)) {
      return { exists: false, value: undefined };
    }

    current = current[token];
  }

  return { exists: true, value: current };
}

function setValueAtPath(target, path, value) {
  const tokens = tokenizePath(path);
  if (tokens.length === 0) return value;

  const root =
    target !== null && typeof target === 'object'
      ? target
      : typeof tokens[0] === 'number'
        ? []
        : {};

  let current = root;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const isLast = i === tokens.length - 1;

    if (isLast) {
      current[token] = value;
      break;
    }

    const nextToken = tokens[i + 1];
    const shouldBeArray = typeof nextToken === 'number';
    const existing = current[token];

    if (existing === null || typeof existing !== 'object') {
      current[token] = shouldBeArray ? [] : {};
    }

    current = current[token];
  }

  return root;
}

export function cleanDeepKeepKeys(obj, options = {}) {
  const { keepKeys = [], ...cleanDeepOptions } = options;

  if (!Array.isArray(keepKeys) || keepKeys.length === 0) {
    return cleanDeep(obj, cleanDeepOptions);
  }

  const existingPaths = collectObjectPaths(obj);
  const preservedMap = new Map();

  const preservePath = path => {
    if (!path) return;
    const state = getPathState(obj, path);
    if (state.exists) {
      preservedMap.set(path, state.value);
    }
  };

  keepKeys.forEach(pattern => {
    if (typeof pattern !== 'string' || !pattern) return;

    if (!pattern.includes('*')) {
      preservePath(pattern);
      return;
    }

    existingPaths.forEach(existingPath => {
      if (matchPathWithWildcard(existingPath, pattern)) {
        preservePath(existingPath);
      }
    });

    // preserve the wildcard parent itself, e.g. "flowInput.*" also keeps "flowInput"
    if (pattern.endsWith('.*')) {
      preservePath(pattern.slice(0, -2));
    }
  });

  let cleaned = cleanDeep(obj, cleanDeepOptions);

  preservedMap.forEach((value, path) => {
    cleaned = setValueAtPath(cleaned, path, value);
  });

  return cleaned;
}
