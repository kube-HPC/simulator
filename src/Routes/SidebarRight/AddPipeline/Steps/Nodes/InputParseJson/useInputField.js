import { useState, useCallback, useEffect, useMemo } from 'react';
import { tryParse, tryParseJson } from 'utils';
import SignInputAddOn from '../../../../../../components/common/SignInputAddOn.react';

const useInputField = (antFields, onRemove) => {
  const hasRemove = !!onRemove;
  const SignsOfObjectArray = ['{', '}'];

  const checkInputObject = (input, words) => {
    if (input !== null && input !== undefined) {
      if (typeof input === 'object' && input !== null) return true;

      if (
        words.some(word =>
          input.toString().toLowerCase().includes(word.toLowerCase())
        )
      )
        return true;

      return false;
    }

    return false;
  };

  const getSignInWord = (input, words) => {
    if (checkInputObject(input, SignsOfObjectArray)) return '';

    let res = '';
    if (input !== null && input !== undefined) {
      words.sort((a, b) => b.length - a.length);
      words.forEach(item => {
        if (res === '' && input.toString().toLowerCase().indexOf(item) !== -1) {
          res = item;
        }
      });
    }

    return res;
  };

  const getWord = (input, word) => {
    if (checkInputObject(input, SignsOfObjectArray)) return input;

    let res = '';

    if (input !== null && input !== undefined) {
      res = input.toString().replace(word, '');
      return res;
    }

    return input;
  };

  const isArrayValue = (input, selectSign) => {
    if (selectSign === '' && input[0] === '[' && input.slice(-1) === ']') {
      const arrayInput = tryParseJson(input);
      if (Array.isArray(arrayInput) && arrayInput.length > 1) {
        return true;
      }

      return false;
    }

    return false;
  };

  const [selectBefore, setSelectBefore] = useState(
    getSignInWord(antFields?.value, antFields?.addonBefore) || ''
  );
  const [addonIsDisabled, setAddonIsDisabled] = useState(false);

  const [isValid, setIsValid] = useState();

  const [value, setValue] = useState(
    getWord(antFields?.value, selectBefore) || ''
  );

  useEffect(() => {
    /**
     * IsValid will override the field most of the time, this is useful when you
     * delete an entry - ant needs to re-write this field you don't want ant to
     * override a field if it is invalid, it will show an "x" and hide the extra
     * invalid characters from the user making it unusable
     */
    if (isValid || value === undefined) {
      if (checkInputObject(value, SignsOfObjectArray)) {
        setValue(JSON.stringify(antFields.value));
        setSelectBefore('');
        setAddonIsDisabled(true);
      } else {
        setValue(value);
        setAddonIsDisabled(false);
      }
    } else {
      setAddonIsDisabled(false);
    }
  }, [antFields, value, isValid]);

  useEffect(() => {
    if (!addonIsDisabled) {
      if (!checkInputObject(value, SignsOfObjectArray)) {
        if (isArrayValue(value, selectBefore)) {
          antFields.onChange(tryParseJson(value));
          setIsValid(true);
        } else {
          antFields.onChange(`${selectBefore}${value}`);
          setIsValid(true);
        }
      } else {
        antFields.onChange(value);
        setAddonIsDisabled(true);
        setIsValid(true);
      }
    }
  }, [selectBefore]);

  const addonBefore = useMemo(
    () =>
      SignInputAddOn({
        state: selectBefore,
        options: antFields?.addonBefore || [],
        callback: setSelectBefore,
        isDisabled: addonIsDisabled,
      }),
    [addonIsDisabled, antFields?.addonBefore, selectBefore]
  );

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      setValue(src);
      const onFail = () => setIsValid(src === '');
      const onSuccess = ({ parsed }) => {
        antFields.onChange(parsed);
        setIsValid(true);
      };

      if (src === '') {
        onSuccess({ parsed: undefined });
        setIsValid(false);
      } else if (checkInputObject(src, SignsOfObjectArray)) {
        tryParse({ src, onSuccess, onFail });

        setAddonIsDisabled(true);
      } else if (isArrayValue(src, selectBefore)) {
        tryParse({ src, onSuccess, onFail });
        setAddonIsDisabled(false);
      } else if (src.startsWith('"') || src.endsWith('"')) {
        onSuccess({ parsed: undefined });
        setIsValid(false);
      } else {
        antFields.onChange(`${selectBefore}${src}`);
        setAddonIsDisabled(false);
        setIsValid(true);
      }
    },
    [antFields, selectBefore]
  );

  return {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  };
};

export default useInputField;
