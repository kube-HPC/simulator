import { useState, useCallback, useEffect, useMemo } from 'react';
import { tryParseJson } from 'utils';
import SignInputAddOn from '../../../../../../components/common/SignInputAddOn.react';
import useWizardContext from '../../../useWizardContext';

const isArray = input => {
  if (input[0] === '[' && input.slice(-1) === ']') {
    const arrayInput = tryParseJson(input);

    if (Array.isArray(arrayInput) && arrayInput.length > 1) {
      return true;
    }

    return false;
  }

  return false;
};

const isNode = (nodeNames, srcValue) => {
  if (nodeNames.length > 0 && nodeNames?.includes(srcValue.split('.')[0])) {
    return true;
  }

  return false;
};

const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const replacePlaceholderNode = (nodeNames, text) => {
  if (nodeNames.length > 0 && nodeNames[0] !== '') {
    return text.toString().replace('<NodeName>', nodeNames[0]);
  }

  return text;
};

const useInputField = (antFields, onRemove, inputRef, selectWidth) => {
  const { valuesState } = useWizardContext();
  const nodeNames = valuesState?.nodes?.map(item => item?.nodeName) || [];

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
    /*  if (isValid || value === undefined) {
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
    } */
  }, [antFields, value, isValid]);

  const addonBefore = useMemo(
    () =>
      SignInputAddOn({
        selectWidth,
        state: selectBefore,
        options: antFields?.addonBefore || [],
        callback: setSelectBefore,
        isDisabled: addonIsDisabled,
      }),
    [addonIsDisabled, antFields?.addonBefore, selectBefore, selectWidth]
  );

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      //   console.log("valid src=", src)
      //  console.log("valid selectBefore=", selectBefore)
      //  console.log("valid antFields?.addonBefore=", antFields?.addonBefore)
      //   console.log("valid nodeNames=", nodeNames)

      let srcValue = src;

      if (parseInt(src, 10)) {
        srcValue = parseInt(src, 10);
      }

      const { rules } = antFields?.addonBefore.filter(
        x => x.value === selectBefore
      )[0];

      setValue(srcValue);

      let isOneValid = false;
      rules.forEach(rule => {
        if (isOneValid === false) {
          if (rule === 'array' && isArray(srcValue)) {
            setIsValid(true);
            antFields.onChange(`${selectBefore}${srcValue}`);
            isOneValid = true;
          } else if (rule === 'object' && isJsonString(srcValue)) {
            setIsValid(true);
            antFields.onChange(JSON.parse(srcValue));
            isOneValid = true;
          } else if (rule === 'node' && isNode(nodeNames, srcValue)) {
            setIsValid(true);
            antFields.onChange(`${selectBefore}${srcValue}`);
            isOneValid = true;
          } else {
            setIsValid(false);
          }
        }
      });

      setAddonIsDisabled(false);

      /*

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
      } */
    },
    [antFields, selectBefore]
  );

  useEffect(() => {
    // console.log(selectBefore, antFields?.addonBefore, antFields)

    onInputChange({ target: { value } });
    /*   if (!addonIsDisabled) {
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
    } */
  }, [selectBefore]);

  useEffect(() => {
    const exampleText = antFields?.addonBefore.filter(
      x => x.value === selectBefore
    );
    // eslint-disable-next-line no-param-reassign
    inputRef.current.input.placeholder = replacePlaceholderNode(
      nodeNames,
      exampleText[0].placeholder
    );
  }, [nodeNames]);

  return {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  };
};

export default useInputField;
