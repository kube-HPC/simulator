import styled from 'styled-components';

export const TabDrawerText = styled.div`
  color: ${props => props.theme.Styles.tabDrawerText.color};

  letter-spacing: 1px;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: rotate(180deg) translate(-98%, -16px);
  -moz-transform: rotate(180deg) translate(-98%, -16px);
  -o-transform: rotate(180deg) translate(-98%, -16px);
  transform: rotate(180deg) translate(-98%, -16px);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
  font-size: 15px;
  margin-bottom: 8px;
`;
export const TabDrawer = styled.div`
  background: ${props => props.theme.Styles.tabDrawer.background};
  border: 1px solid ${props => props.theme.Styles.tabDrawer.border};
  border-top: 0px;
  min-width: 193px;
  position: fixed;
  text-align: center;
  margin-left: -24px;
  margin-top: 15px;
  z-index: 1000;

  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

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
