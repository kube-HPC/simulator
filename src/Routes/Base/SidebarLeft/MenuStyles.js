import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { Theme, COLOR_LAYOUT } from 'styles';
import styled from 'styled-components';
import { Layout, Menu, Badge } from 'antd';
import Icon from '@ant-design/icons';

export const Border = styled.div`
  border-right: 1px solid ${COLOR_LAYOUT.border};
`;
export const Sider = styled(Layout.Sider)`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }
`;
export const MenuMargin = styled(Menu)`
  margin-top: 10px;
`;
export const tagStyle = { color: Theme.Styles.SidebarLeft.colorTagNumber };
export const IconStyle = {
  fontSize: 20,
};

export const IconLogo = styled(Icon)`
  && {
    margin-bottom: 5px;
    margin-left: 5px;
    font-size: 75px;
  }
`;
export const TitleCenter = styled(LogoTitle)`
  align-self: flex-start;
`;

export const LogoContainer = styled.div`
  margin-top: 10px;
  display: flex;
`;

export const Name = styled.span`
  text-transform: capitalize;
`;
export const BadgeStyle = styled(Badge)`
  margin-top: 9px;
  right: 16px;
  position: absolute;
`;
