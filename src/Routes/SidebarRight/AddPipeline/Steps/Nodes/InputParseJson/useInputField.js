import { useState, useCallback, useEffect, useMemo } from 'react';
import { tryParse, tryParseJson } from 'utils';
import SignInputAddOn from '../../../../../../components/common/SignInputAddOn.react';

const useInputField = (antFields, onRemove) => {
  const hasRemove = !!onRemove;
  const SignsOfObjectArray = ['{', '}'];

  const checkInputObject = (input, words) => {
    if (input != null) {
      if (typeof input === 'object') return true;

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
      words.sort((a, b) => b.value.length - a.value.length);
      words.forEach(item => {
        if (
          res === '' &&
          input
            .toString()
            .toLowerCase()
            .indexOf(item.value.toString().toLowerCase()) !== -1
        ) {
          res = item.value;
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
      let srcValue = src;
      if (parseInt(src, 10)) {
        srcValue = parseInt(src, 10);
      }

      setValue(srcValue);
      const onFail = () => setIsValid(srcValue === '');
      const onSuccess = ({ parsed }) => {
        antFields.onChange(parsed);
        setIsValid(true);
      };

      if (srcValue === '') {
        onSuccess({ parsed: undefined });
        setIsValid(false);
      } else if (checkInputObject(srcValue, SignsOfObjectArray)) {
        tryParse({ srcValue, onSuccess, onFail });

        setAddonIsDisabled(true);
      } else if (isArrayValue(srcValue, selectBefore)) {
        tryParse({ srcValue, onSuccess, onFail });
        setAddonIsDisabled(false);
      } else if (
        !Number.isInteger(srcValue) &&
        (srcValue.startsWith('"') || srcValue.endsWith('"'))
      ) {
        onSuccess({ parsed: undefined });
        setIsValid(false);
      } else if (Number.isInteger(srcValue) && selectBefore === '') {
        antFields.onChange(srcValue);
        setAddonIsDisabled(false);
        setIsValid(true);
      } else {
        antFields.onChange(`${selectBefore}${srcValue}`);
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
