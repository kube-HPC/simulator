import styled from 'styled-components';
import logo from "../images/logo.svg";
import { HCOLOR } from '../constants/colors';
import { Button, Layout, BackTop, Row, Col , Menu } from 'antd';

const {Header, Sider, Content} = Layout;

export const ButtonAddPipeline = styled(Button)`
    background-color: transparent;
    color: ${HCOLOR.colorPrimary};
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
      color: ${HCOLOR.colorPrimary};
      border-color: transparent;
    }
`

export const Paragraph = styled.p`
    margin-top: 1em;
    margin-bottom: auto;
`

export const HLayout = styled(Layout)`
  ${LayoutHeader}
`

export const HSider = styled(Sider)`
  height: -webkit-fill-available;
  background: ${HCOLOR.colorAccent};
`

export const HMenu = styled(Menu)`
  background: ${HCOLOR.colorAccent};
`

export const LayoutHeader = styled(Header)`
  ${LayoutHeader} {
    background: ${HCOLOR.header}
  }
  z-index: 2;
  border-bottom: 1pt solid ${HCOLOR.headerBorder};
  padding: 0 10px;
`

export const AlignRow = styled(Row)`
  text-align: center;
  height: 1vh;
`

export const HeaderTitle = styled.span`
  text-transform: uppercase;
  color: ${HCOLOR.colorPrimary};
  font-size: 30px;
  font-weight: bold;
  font-family: monospace;
  letter-spacing: 1px;
  position: absolute;
`

export const Logo = styled.img.attrs({src: logo})`
  width: 5vh;
`

export const HContent = styled(Content)`
  background: ${HCOLOR.content};
`

export const HAddButton = styled(Button)`
  text-align: center;
  position: absolute;
  width: 56px;
  height: 56px;
  top: 90%;
  right: 3%;
  box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)
`