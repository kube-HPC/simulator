import styled from 'styled-components';

export const TabDrawerText = styled.div`
  color: ${props => (props.theme.isDarkMode ? '#ffffff' : '#333333')};

  letter-spacing: 7px;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: rotate(180deg) translate(-98%, -16px);
  -moz-transform: rotate(180deg) translate(-98%, -16px);
  -o-transform: rotate(180deg) translate(-98%, -16px);
  transform: rotate(180deg) translate(-98%, -16px);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
  font-size: 18px;
  margin-top: 19px;
`;
export const TabDrawer = styled.div`
  background: ${props => (props.theme.isDarkMode ? '#004285' : '#ffffff')};
  border: 1px solid ${props => (props.theme.isDarkMode ? '#586a93' : '#ffffff')};
  min-width: 200px;
  position: fixed;
  text-align: center;
  margin-left: -24px;
  margin-top: 15px;
  z-index: 1000;
  padding-left: 25px;
  padding-right: 25px;

  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;

  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: rotate(90deg) translate(0px, 0px);
  -moz-transform: rotate(90deg) translate(0px, 0px);
  -o-transform: rotate(90deg) translate(0px, 0px);
  transform: rotate(90deg) translate(0px, 0px);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
`;
