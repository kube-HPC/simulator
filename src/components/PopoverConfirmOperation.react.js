import { Popover, Button } from 'antd';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal.action';
import { withState } from 'recompose';
import React from 'react';


const PopoverConfirmOperation = (props) => {
  const { children, onConfirm, onCancel, isVisible, position ,content } = props;
  return (
    
    <Popover
      content={
        <div >
          {content}
          <Button type="primary" onClick={onConfirm}> Confirm </Button>
          <Button style={{left:'65%'}} onClick={onCancel}> Cancel </Button>
        </div>

      }

      title="Select Algorithm for debugging"
      trigger="click"
      placement={position}
      visible={isVisible}>
      {children}

    </Popover>

  );
};

export default PopoverConfirmOperation;
// const mapStateToProps = (state) => ({
//   modal: state.modal
// });

// export default connect(mapStateToProps, { closeModal})(
//   withState('isVisible', 'onPopoverClick', false)(PopoverConfirmOperation)
// );
