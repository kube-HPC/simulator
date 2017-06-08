/// <reference types="react" />
import * as React from 'react';
export interface IconProps {
    type: string;
    className?: string;
    title?: string;
    onClick?: React.MouseEventHandler<any>;
    spin?: boolean;
    style?: React.CSSProperties;
}
declare var _default: (props: IconProps) => JSX.Element;
export default _default;
