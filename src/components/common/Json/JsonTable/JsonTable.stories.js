import React from 'react';
import { SB_SECTIONS } from 'const';
import JsonTable from './JsonTable.react';

export default {
  title: `${SB_SECTIONS.COMMON}|Json Table`,
};

const jsonObject = {
  Analyst: { name: 'Jack', email: 'jack@xyz.com' },
  'Loaded by': 'Jills',
  'Load id': 34,
  'git id': 'xxqaygqertqsg98qhpughqer',
  'Analysis Id': '7asdlnagsd98gfaqsgf',
  'Load Date': 'July 12, 2018',
  'Data Source': 'Study XY123-456',
  'Jira Ticket': 'Foo-1',
  'Confluence URL': 'http://myserver/wxyz',
  'Study sponsors': [
    { name: 'john', email: 'john@@xyz.com' },
    { name: 'jane', email: 'jane@@xyz.com' },
  ],
};

// const jsonTable = [
//   {
//     header: 'Analyst',
//     value: {},
//   },
// ];

export const Default = () => <JsonTable jsonObject={jsonObject} />;
