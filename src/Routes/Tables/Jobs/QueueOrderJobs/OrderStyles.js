import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';

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

  flex-direction: ${props => (props.$isDirectionColumn ? 'column' : 'row')};
`;
export const DividerTables = styled(LeftOutlined)`
  font-size: 24px;
  align-self: center;
`;

export const TitleTable = styled.div`
  font-size: 24px;
  margin-top: 20px;
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
  }
  table {
    border-collapse: collapse;
  }
`;

export const FilterTable = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
