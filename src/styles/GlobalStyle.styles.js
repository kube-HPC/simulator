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

.ant-layout {
  background-color:  white;
}

.ant-select-item-option-content:empty:before{
  content: '[empty]';
}
.ant-tag{
    border-radius:4px;
  }

.JaegerTrace .TimelineCollapser
{
  display:none;
}

.mark 
{
  background-color:yellow;
}
`;

export default GlobalStyle;
