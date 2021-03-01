import { createContext, useContext } from 'react';

export const context = createContext();

/**
 * @returns {import('antd/lib/form').FormComponentProps & {
 *   initialState: object;
 * }}
 */
export default () => useContext(context);
