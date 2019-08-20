import React from 'react';
import { List } from 'antd';
import PropTypes from 'prop-types';

const NodeLogs = ({ dataSource, ...props }) => {
  const renderItem = log => (
    <List.Item>
      <List.Item.Meta description={log.message} />
    </List.Item>
  );

  return <List dataSource={dataSource} renderItem={renderItem} />;
};

// class NodeLogs extends Component {
//   constructor() {
//     super();
//     this.isAlreadySelected = false;
//     this.currentTaskId = null;
//   }

//   render() {
//     const { props } = this;
//     let menu =
//       props &&
//       props.taskDetails &&
//       props.taskDetails.map((task, index) => (
//         <Menu.Item key={index}>{`(${index + 1}) ${task.taskId}`}</Menu.Item>
//       ));
//     this.currentTaskId =
//       props && props.taskDetails
//         ? this.isAlreadySelected
//           ? this.currentTaskId
//           : props.taskDetails[0].taskId
//         : null;
//     let menuList = (
//       <Menu
//         onClick={data => {
//           this.isAlreadySelected = true;
//           this.currentTaskId = props.taskDetails[data.key].taskId;
//           props.rerunLogs(this.currentTaskId);
//         }}
//       >
//         {menu}
//       </Menu>
//     );

//     const logsTemplate = props.log.map((l, i) => {
//       // const _color = i % 2 ? "black" : "rgba(0,0,0,0.8)"
//       return (
//         <li key={i} style={{ marginBottom: '4px' }}>
//           <span style={{ color: '#eeda13' }}>{l.meta}</span>
//           <span style={{ color: '#fff' }}>:: </span>
//           <span style={{ color: 'white', textIndent: '10px' }}>{l.message}</span>
//         </li>
//       );
//     });

//     return (
//       <div id="log">
//         <span style={{ paddingLeft: '10px', color: '#1890ff' }}>
//           <Dropdown
//             overlay={menuList}
//             trigger={['click']}
//             getPopupContainer={() => document.getElementById('log')}
//           >
//             <span className="ant-dropdown-link">
//               {this.currentTaskId} <Icon type="down" />
//             </span>
//           </Dropdown>
//         </span>
//         <ul
//           style={{
//             background: 'rgba(0,0,0,0.8)',
//             margin: '1%',
//             overflowY: 'auto',
//             overflowX: 'hidden',
//             height: '70vh',
//             listStyleType: 'none'
//           }}
//         >
//           {logsTemplate}
//         </ul>
//       </div>
//     );
//   }
// }

NodeLogs.propTypes = {
  dataSource: PropTypes.array.isRequired
};
export default NodeLogs;
