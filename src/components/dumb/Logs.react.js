import React, { Component } from 'react';
import { Button, Menu, Dropdown, Icon } from 'antd';
import PropTypes from 'prop-types';


class Logs extends Component {
  constructor() {
    super();
    this.isAlreadySelected = false;
    this.currentTaskId = null;
  }

  render() {
    const { props } = this;
    let menu = props && props.taskDetails && props.taskDetails.map((task, index) => <Menu.Item key={index}>{`(${index + 1}) ${task.taskId}`}</Menu.Item>)
    this.currentTaskId = props && props.taskDetails ? this.isAlreadySelected ? this.currentTaskId : props.taskDetails[0].taskId : null;
    let menuList =
      < Menu onClick={(data) => {
        this.isAlreadySelected = true;
        this.currentTaskId = props.taskDetails[data.key].taskId;
        props.rerunLogs(this.currentTaskId)
        console.log(props.taskDetails[data.key])
      }} >
        {menu}
      </Menu >

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
      <div id="log" >
        <span style={{ paddingLeft: '10px', color: "#1890ff" }} >
          <Dropdown overlay={menuList} trigger={['click']} getPopupContainer={() => document.getElementById('log')}>
            <span className="ant-dropdown-link">
              {this.currentTaskId} <Icon type="down" />
            </span>
          </Dropdown>
        </span>
        <Button type="primary" style={{ left: "35%" }} icon="redo" onClick={() => props.rerunLogs(this.currentTaskId)}>Refresh</Button>
        <ul style={{
          background: 'rgba(0,0,0,0.8)', margin: '20px', padding: '10px',
          overflowY: 'auto', overflowX: 'hidden', height: '80vh'
        }}>
          {logsTemplate}
        </ul>
      </div>
    )
  }
}

Logs.propTypes = {
  log: PropTypes.array,
  rerunLogs: PropTypes.func,
  taskDetails: PropTypes.array
};
export default Logs;