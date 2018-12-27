import styled from 'styled-components';
import { Button, Layout } from 'antd';

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
`