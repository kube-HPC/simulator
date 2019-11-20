import { createGlobalStyle } from 'styled-components';
import { COLOR_LAYOUT, COLOR } from 'styles/colors';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .ant-tooltip-inner {
    background-color: white;
    color: black;
  }

  .ant-layout-sider-light .ant-layout-sider-trigger {
    border-right: 1px solid ${COLOR_LAYOUT.border};
  }

  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: hidden !important;
    margin-bottom: 0px !important;
  }

  ::-webkit-scrollbar-track {
    border: none;
    background-color: none;
  }
  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border: 1px solid ${COLOR.grey};
    background-color: ${COLOR.blueLight};
  }
`;

export default GlobalStyle;
