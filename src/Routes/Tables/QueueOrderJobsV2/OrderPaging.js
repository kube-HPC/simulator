import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Button } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

export const NumberJobs = styled.div``;

export const PagingContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  margin: 10px auto;
  justify-content: space-around;

  input {
    text-align: center;
  }
`;

class OrderPaging extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {
      HasPrev,
      HasNext,
      pageGoToView,
      numberRowToView,
      onChangeNumberRow,
      TypeTable,
    } = this.props;

    return (
      <PagingContainer>
        <NumberJobs>({HasPrev} jobs)</NumberJobs>
        <Button
          type="text"
          disabled={!HasPrev > 0}
          onClick={() => pageGoToView(TypeTable, 'begin')}
          icon={<StepBackwardOutlined />}
        />
        <Button
          type="text"
          disabled={!HasPrev > 0}
          onClick={() => pageGoToView(TypeTable, 'previous')}
          icon={<LeftOutlined />}
        />
        <InputNumber
          min={2}
          max={100}
          defaultValue={numberRowToView}
          onChange={onChangeNumberRow}
        />

        <Button
          type="text"
          disabled={!HasNext > 0}
          onClick={() => pageGoToView(TypeTable, 'next')}
          icon={<RightOutlined />}
        />
        <Button
          type="text"
          disabled={!HasNext > 0}
          onClick={() => pageGoToView(TypeTable, 'end')}
          icon={<StepForwardOutlined />}
        />
        <NumberJobs>({HasNext} jobs)</NumberJobs>
      </PagingContainer>
    );
  }
}

OrderPaging.propTypes = {
  pageGoToView: PropTypes.func.isRequired,
  HasPrev: PropTypes.number.isRequired,
  HasNext: PropTypes.number.isRequired,
  numberRowToView: PropTypes.number.isRequired,
  onChangeNumberRow: PropTypes.func.isRequired,
  TypeTable: PropTypes.string.isRequired,
};

export default OrderPaging;
