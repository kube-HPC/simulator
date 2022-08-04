import styled from 'styled-components';
import { Form } from 'antd';

export const FiltersForms = styled(Form)`
    justify-content: ${props =>
      props.isSpaceAround ? 'space-around' : 'start'};
    border: 1px solid ${props => props.theme.Styles.filters.borderColor};
    border-radius: 10px;
    margin: 4px;
    padding: 8px;
    background: ${props => props.theme.Styles.filters.backgroundColor}; 
    box-shadow: box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 2px;

    .ant-select-selector,
    .ant-picker{
        border-radius: 20px!important;
    }
`;
