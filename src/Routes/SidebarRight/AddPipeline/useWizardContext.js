import { createContext, useContext } from 'react';

export const context = createContext();

/**
 * @typedef {import('antd/lib/form/Form.d').GetFieldDecoratorOptions} GetFieldDecoratorOptions
 * @returns {import('antd/lib/form').FormComponentProps & {
 *   initialState: object;
 *   fieldDecorator: (
 *     id: string,
 *     props: GetFieldDecoratorOptions
 *   ) => React.ReactNode;
 *   isStreamingPipeline: boolean;
 * }}
 */
export default () => useContext(context);
