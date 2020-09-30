import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, JsonEditor, FlexBox } from 'components/common';
import { Button } from 'antd';
import { tryParse } from 'utils';
import styled from 'styled-components';

const BlockItem = styled(FlexBox.Item)`
  width: 100%;
`;

const ColumnFlex = styled(FlexBox)`
  flex-direction: column;
`;

const FlowInput = React.forwardRef(
  // TODO: consider removing the forward red
  // eslint-disable-next-line
  ({ onChange, value: initial }, ref) => {
    const [value, setValue] = useState(initial);
    const onApply = () => {
      const onSuccess = ({ parsed }) => onChange(parsed);
      tryParse({ src: value, onSuccess });
    };
    return (
      <Card>
        <ColumnFlex>
          <BlockItem className="jsonEditor">
            <JsonEditor onChange={setValue} value={value} height="50vh" />
          </BlockItem>
          <br />
          <BlockItem>
            <Button block onClick={onApply} type="dashed">
              Apply Change
            </Button>
          </BlockItem>
        </ColumnFlex>
      </Card>
    );
  }
);

FlowInput.propTypes = {
  // TODO: detail the props
  /* eslint-disable */
  onChange: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable */
};

export default FlowInput;
