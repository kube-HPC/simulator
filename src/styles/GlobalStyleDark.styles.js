import { COLOR_LAYOUT, COLOR } from 'styles/colors';
import 'antd/dist/antd.dark.css';
import './../styles/dark-mode-style.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyleDark = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .ant-tooltip-inner {
    background-color: white;
    color: black;
  }
  
  .ant-layout-content{
    overflow-x: hidden;
  }

  .ant-layout-sider-light .ant-layout-sider-trigger {
    border-right: 1px solid ${COLOR_LAYOUT.border};
  }


  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: hidden !important;
    margin-bottom: 0px !important;
  }

  .ant-table table {
    border-collapse: collapse;
  }

  ::-webkit-scrollbar-track {
    border: none;
    background-color: none;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border: 0.5px solid ${COLOR.grey};
    background-color: ${COLOR_LAYOUT.border};
  }

  .row-dragging {

  }
  
  .row-dragging td {
    padding: 16px;
  }
  
  .row-dragging .drag-visible {
    visibility: visible;
  }

`;

export default GlobalStyleDark;
