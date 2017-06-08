/// <reference types="react" />
import React from 'react';
export interface RadioButtonProps {
    value: string | number;
    style?: React.CSSProperties;
    disabled?: boolean;
    checked?: boolean;
    onChange?: (e: any) => any;
}
export default class RadioButton extends React.Component<RadioButtonProps, any> {
    static defaultProps: {
        prefixCls: string;
    };
    static contextTypes: {
        radioGroup: React.Requireable<any>;
    };
    render(): JSX.Element;
}
