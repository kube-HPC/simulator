import styled from 'styled-components';
import logo from "../images/logo.svg";
import color from '../constants/colors';
import { Button, Layout, BackTop, Row, Col , Menu } from 'antd';

const {Header, Sider, Content} = Layout;

export const ButtonAddPipeline = styled(Button)`
    background-color: transparent;
    color: #307fe6;
    font-size: 15px;
    font-family: monospace;
    letter-spacing: 1px;
    border-color: transparent;
    box-shadow: none;

    ${ButtonAddPipeline}:hover {
      color: rgba(0, 0, 0, 0.62);
      border-color: transparent;
    }

    ${ButtonAddPipeline}:focus {
      color: #307fe6;
      border-color: transparent;
    }
`

export const Paragraph = styled.p`
    margin-top: 1em;
    margin-bottom: auto;
`

export const DynamicLayout = styled(Layout)`
  min-height: -webkit-fill-available;
  ${LayoutHeader}
`

export const LayoutHeader = styled(Header)`
  ${LayoutHeader} {
    background: white
  }
  z-index: 2;
  border-bottom: 1pt solid #ccc;
  padding: 0 10px;
`

export const AlignRow = styled(Row)`
  text-align: center;
  height: 1vh;
`

export const HeaderTitle = styled.span`
  text-transform: uppercase;
  color: ${color.blue};
  font-size: 30px;
  font-weight: bold;
  font-family: monospace;
  letter-spacing: 1px;
  position: absolute;
`

export const Logo = styled.img.attrs({src: logo})`
  width: 5vh;
`