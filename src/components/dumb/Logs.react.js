import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const Logs = (props) => {
    const logsTemplate = props.log.map((l, i) => {
        // const _color = i % 2 ? "black" : "rgba(0,0,0,0.8)"

        return (
          <li key={i} style={{ marginBottom: '4px' }}>
            <span style={{ color: '#eeda13' }}>{l.meta}</span>
            <span style={{ color: '#fff' }}>:: </span>
            <span style={{ color: 'white', textIndent: '10px' }}>{l.message}</span>
          </li>)
    }
    )


    return (
      <div>
    
        <Button type="primary" style={{left: "85%"}}  icon="redo" onClick={() => props.rerunLogs()}>Refresh</Button>
        <ul style={{
                background: 'rgba(0,0,0,0.8)', margin: '20px', padding: '10px',
                overflowY: 'auto', overflowX: 'hidden', height: '80vh'
            }}>
          {logsTemplate}
        </ul>
      </div>
    )
}

Logs.propTypes = {
    log: PropTypes.array,
    rerunLogs: PropTypes.func,
  };
export default Logs;