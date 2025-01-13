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
      let srcValue = src;

      if (typeof src === 'number' && parseInt(src, 10)) {
        srcValue = parseInt(src, 10);
      }

      const { rules, label } = antFields?.addonBefore.filter(
        x => x.value === selectBefore
      )[0] || { rules: [], label: '' };

      setValue(srcValue);

      let isOneValid = false;

      rules.forEach(rule => {
        if (isOneValid === false) {
          if (
            (label === '(@)Output of' || label === '(#@)Multi output of') &&
            rule === 'flowinput' &&
            srcValue.toLowerCase().includes('flowinput')
          ) {
            setIsValid(true);

            isOneValid = true;
          } else if (
            label === 'Value' &&
            rule === 'array' &&
            isArray(srcValue)
          ) {
            setIsValid(true);
            antFields.onChange(JSON.parse(srcValue));
            isOneValid = true;
          } else if (rule === 'array' && isArray(srcValue)) {
            setIsValid(true);
            antFields.onChange(`${selectBefore}${srcValue}`);
            isOneValid = true;
          } else if (rule === 'object' && isJsonString(srcValue)) {
            setIsValid(true);
            antFields.onChange(JSON.parse(srcValue));
            isOneValid = true;
          } else if (
            rule === 'object' &&
            (typeof srcValue === 'object' || typeof srcValue === 'function') &&
            srcValue !== null
          ) {
            setIsValid(true);
            antFields.onChange(srcValue);
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
    },
    [antFields, selectBefore]
  );

  useEffect(() => {
    onInputChange({ target: { value } });
    const exampleText = antFields?.addonBefore.filter(
      x => x.value === selectBefore
    );
    // eslint-disable-next-line no-param-reassign
    inputRef.current.input.placeholder = exampleText[0].placeholder;
  }, [selectBefore]);

  return {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  };
};

export default useInputField;
