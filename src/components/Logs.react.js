import React from 'react';

const Logs = (props) => {
    const logsTemplate = props.log.map((l, i) => {
    const _color=i%2?"black":"rgba(0,0,0,0.8)"

        return (<li style={{marginBottom: '4px'}}>
           <span style={{color:'#eeda13'}}>{l.meta}</span>
           <span style={{color:'#fff'}}>:: </span> 
           <span style={{color:'white', textIndent: '10px'}}>{l.message}</span> 
            </li>)
    }
    )


    return (
        <ul style={{
            background: 'rgba(0,0,0,0.8)', margin: '20px', padding: '10px',
            overflowY: 'auto', overflowX: 'hidden', height: '80vh'
        }}>
            {logsTemplate}
        </ul>)
}
export default Logs;