import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';

export const FlexItems = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
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
  // width: 50%;
  tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }
`;

export const FilterTable = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
