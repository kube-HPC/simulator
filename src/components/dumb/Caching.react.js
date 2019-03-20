import React from 'react';
import { Button } from 'antd';

const Caching = props => (
  <div>
    <span style={{ padding: '10px' }}>caching from this node</span>
    <Button type="primary" onClick={() => props.runCaching()}>
      {' '}
      Start
    </Button>
  </div>
);

export default Caching;
