import { createGlobalStyle } from 'styled-components';
import { COLOR_LAYOUT, COLOR } from 'styles/colors';

const GlobalStyle = createGlobalStyle`
body{
  margin:0;
}
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.cursor-pointer{
  cursor: pointer;
}

.ant-tooltip-inner {
  background-color: white;
  color: black;
}

.ant-layout-content{
  overflow-x:${({ location: { pathname, search } = {} } = {}) =>
    ['/algorithms', '/pipelines'].includes(pathname) ||
    (['/jobs'].includes(pathname) && !search.indexOf('view=grid') > 0)
      ? 'none'
      : 'hidden'};
}

  overflow-x:${({ location: { pathname, search } = {} } = {}) =>
    ['/algorithms', '/pipelines'].includes(pathname) ||
    (['/jobs'].includes(pathname) && !search.indexOf('view=grid') > 0)
      ? 'none'
      : 'hidden'};
  
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
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border: 1px solid ${COLOR.grey};
  background-color: ${COLOR_LAYOUT.border};
  border-radius: 10px;
}



.ant-select-item-option-content:empty:before{
  content: '[empty]';
}

.row-dragging {
  background: #fafafa;
  border: 1px solid #ccc;
}

.row-dragging td {
  padding: 16px;
}

.row-dragging .drag-visible {
  visibility: visible;
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

.active-row {
  background-color:#f5faff;
}
.icon-left span{

  font-size: 20px !important;
}

.hidden-addon-before{
  .ant-input-group-addon:first-child{
    display:none;
  }
}
.expanded-row-disable,
.expanded-row-disable .ant-table-cell-row-hover,
.expanded-row-disable .ant-table-column-sort {
  background:#ccc !important;
}

`;

export default GlobalStyle;
