// eslint-disable-next-line
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { tryParse } from 'utils';
import RawInputField from 'components/InputField';
import Addon from '../../../../../../components/common/Addon.react';

function checkInput(input, words) {
  if (input !== undefined) {
    if (Array.isArray(input) && input.length > 1) return true;

    if (typeof input === 'object' && input !== null) return true;

    return words.some(word =>
      input.toString().toLowerCase().includes(word.toLowerCase())
    );
  }

  return false;
}

function getSignInWord(input, words) {
  let res = '';

  if (input !== null && input !== undefined && input.length === 1) {
    words.sort((a, b) => b.length - a.length);

    words.forEach(item => {
      if (res === '' && input[0].toLowerCase().indexOf(item) !== -1) {
        res = item;
      }
    });
  }

  return res;
}

function getWord(input, word) {
  let res = '';

  if (input !== null && input !== undefined && input.length === 1) {
    res = input[0].replace(word, '');
    return res;
  }

  return input;
}

const InputField = ({ placeholder, tooltip, onRemove, idx, ...antFields }) => {
  const [selectBefore, setSelectBefore] = useState(
    getSignInWord(antFields?.value, antFields?.addonBefore) || ''
  );
  const [addonIsDisabled, setAddonIsDisabled] = useState(false);

  const [isValid, setIsValid] = useState();

  const [value, setValue] = useState(
    getWord(antFields?.value, selectBefore) || ''
  );
  const hasRemove = !!onRemove;

  useEffect(() => {
    /**
     * IsValid will override the field most of the time, this is useful when you
     * delete an entry - ant needs to re-write this field you don't want ant to
     * override a field if it is invalid, it will show an "x" and hide the extra
     * invalid characters from the user making it unusable
     */
    if (isValid || value === undefined) {
      if (checkInput(value, ['{', '}', '[', ']'])) {
        setValue(JSON.stringify(antFields.value));
      } else {
        setValue(value);
      }
    }
  }, [antFields, value, isValid, selectBefore]);

  useEffect(() => {
    if (!checkInput(value, ['{', '}', '[', ']'])) {
      antFields.onChange([`${selectBefore}${value}`]);
      setIsValid(true);
    } else {
      antFields.onChange(value);
      setAddonIsDisabled(true);
      setIsValid(true);
    }
  }, [selectBefore]);

  const addonBefore = useMemo(
    () =>
      Addon({
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
      } else if (checkInput(src, ['{', '}', '[', ']'])) {
        tryParse({ src, onSuccess, onFail });
        setAddonIsDisabled(true);
      } else {
        antFields.onChange([`${selectBefore}${src}`]);
        setAddonIsDisabled(false);
        setIsValid(true);
      }
    },
    [antFields, selectBefore]
  );

  //  useEffect(()=>{

  //   console.log("initialState >>> ",initialState.nodes[0].input)

  // },[onRemove]
  // )

  return (
    <RawInputField
      id={antFields.id}
      tooltip={tooltip}
      hasRemove={hasRemove}
      isValid={isValid}
      onRemove={() => onRemove(idx)}
      value={value}
      onChange={onInputChange}
      placeholder={placeholder}
      addonBefore={addonBefore}
    />
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string,
  tooltip: PropTypes.string,
  onRemove: PropTypes.func,
  idx: PropTypes.string.isRequired,
  // under antFields
  value: PropTypes.node,
  id: PropTypes.node,
  onChange: PropTypes.func,
  addonBefore: PropTypes.func,
};

InputField.defaultProps = {
  onRemove: null,
  placeholder: null,
  tooltip: null,
  value: undefined,
  id: undefined,
  onChange: undefined,
  addonBefore: undefined,
};

export default InputField;
