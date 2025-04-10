import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Dropdown } from 'antd';
import styled from 'styled-components';

const DropdownButtonStyle = styled(Dropdown.Button)`
  & > button {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    padding: 10px;

    background: ${props =>
      (props.$isOn && props.$bgColor) || 'initial'} !important;
    color: ${props =>
      props.$isOn && props.$bgColor ? '#ffffff' : 'initial'} !important;

    &:hover {
      background: ${props =>
        (props.$isOn && props.$bgColor) || 'initial'} !important;
      color: ${props =>
        props.$isOn && props.$bgColor ? '#ffffff' : 'initial'} !important;
    }
  }

  button:first-child {
    width: 100px;
  }
`;

const ButtonDropdown = React.memo(
  ({ options, defaultLabel, onButtonClick }) => {
    const [isButtonOn, setIsButtonOn] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    const handleButtonClick = () => {
      if (onButtonClick) {
        setIsButtonOn(prev => !prev);
        onButtonClick(isButtonOn === false ? selected.label : '');
      } else {
        setIsButtonOn(prev => !prev);
        console.info(`click left button : ${selected.label}`);
      }
    };

    const handleMenuClick = e => {
      const selectedItem = options.find(opt => opt.key === e.key);

      if (selectedItem) {
        setIsButtonOn(true);
        setSelected({
          label: selectedItem.label,
          value: selectedItem.value,
          color: selectedItem.color,
        });
        if (onButtonClick) {
          onButtonClick(selectedItem.label);
        }
      }
    };

    const menuProps = {
      items: options,
      onClick: handleMenuClick,
    };

    useEffect(() => {
      const found = options.find(opt => opt.label === defaultLabel);
      if (found) {
        setSelected(found);
      }
    }, [defaultLabel, options]);

    return (
      <DropdownButtonStyle
        icon={<DownOutlined />}
        menu={menuProps}
        onClick={handleButtonClick}
        $bgColor={selected.color}
        $isOn={isButtonOn}
        type={isButtonOn ? '' : 'dashed'}>
        {selected.label}
        {isButtonOn ? (
          <CloseCircleFilled style={{ fontSize: '12px', color: '#bbbbbb' }} />
        ) : null}
      </DropdownButtonStyle>
    );
  }
);

ButtonDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  defaultLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default ButtonDropdown;
