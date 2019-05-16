import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { HCOLOR } from 'constants/colors';

const DivBottom = styled(Row)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${HCOLOR.border};
  padding: 10px 16px;
  background: ${HCOLOR.background};
  text-align: right;
  margin-top: 10px;
`;

const marginButtons = buttons =>
  buttons.map((button, i) => <Col key={i}>{button}</Col>);

function BottomContent(props) {
  return (
    <DivBottom>
      <Row type="flex" gutter={10} justify="end">
        {marginButtons(React.Children.toArray(props.children))}
      </Row>
    </DivBottom>
  );
}

BottomContent.propTypes = {
  children: PropTypes.array
};

export default BottomContent;
