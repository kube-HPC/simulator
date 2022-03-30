import styled from 'styled-components';
import { Table, Select, Badge } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

export const DeleteOverTable = styled.div`
  position: absolute;
  z-index: 999;
  background: white;
  width: 41%;
  height: 65%;
  text-align: center;
  vertical-align: middle;
  display: ${props => (props.$isDisplay ? '' : 'none')};
  font-size: 20px;
  padding: 5%;
  opacity: 0.8;
`;

export const FlexItems = styled.div`
  display: flex;

  flex-direction: 'column';
`;
export const DividerTables = styled.div`
  margin-left: 15px;
  margin-right: 5px;
  width: 1px;
  border: 1px solid #0072ff0a;
`;

export const TitleTable = styled.div`
  font-size: 24px;
  margin-top: 20px;
  display: inline-block;
`;

export const ContainerArea = styled.div`
  margin-left: 10px;
  flex: 1;

  tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }

  tbody {
    cursor: move;
  }

  .ant-table-content {
    overflow-y: auto;
    height: ${props => (props.$isDirectionColumn ? '27vh' : '70vh')};
  }
  .ant-table-content thead {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: ${props => props.theme.Styles?.backgroundTheme};
  }
  }
  table {
    border-collapse: collapse;
  }
`;

export const FilterTable = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const TableItem = styled(Table)`
  .ant-table {
    border-bottom: solid 1px ${props => props.theme.Styles?.line};
  }
  .ant-table-thead > tr > th {
    background: none;
  }
`;

export const TableAllInOne = styled(Table)`
  .ant-table-thead > tr > th {
    background: none;
  }
`;
export const HeaderTitlePreferred = styled.div`
  position: absolute;
  right: 64px;
  padding: 5px;
`;

export const SelectGroupBy = styled(Select)`
  width: 200px;
`;

export const BadgeCount = styled(Badge)`
  sup {
    position: relative;
    left: 10px;
    font-size: 14px;
  }
`;

export const IconConcurrency = styled(FieldTimeOutlined)`
  font-size: 22px;
  color: #ff7700;
`;
