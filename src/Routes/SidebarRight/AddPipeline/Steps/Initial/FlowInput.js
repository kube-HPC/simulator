import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, JsonEditor } from 'components/common';
import { tryParse } from 'utils';
import { useDebouncedCallback } from 'use-debounce';
import { COLOR } from 'styles';

const FlowInput = React.forwardRef(
  // TODO: consider removing the forward red
  /**
   * @param {object} props
   * @param {React.CSSProperties} props.style
   */
  // eslint-disable-next-line
  ({ onChange, value: initial, style }, ref) => {
    const [value, setValue] = useState(initial);
    const [hasFailed, setFail] = useState(false);
    const onApply = useCallback(() => {
      const onSuccess = ({ parsed }) => {
        setFail(false);
        onChange(parsed);
      };
      if (value)
        tryParse({ src: value, onSuccess, onFail: () => setFail(true) });
    }, [onChange, value]);

    const submitChange = useDebouncedCallback(onApply, 1000);

    const handleChange = useCallback(
      nextValue => {
        setValue(nextValue);
        submitChange();
      },
      [setValue, submitChange]
    );

    return (
      <Card
        bodyStyle={{ height: '100%' }}
        style={{ borderColor: hasFailed ? COLOR.red : undefined, ...style }}>
        <JsonEditor onChange={handleChange} value={value} />
      </Card>
    );
  }
);

FlowInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object,
};
FlowInput.defaultProps = {
  style: {},
};

export default FlowInput;
