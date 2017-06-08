import { Popover, Button } from 'antd';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal.action';
import { withState } from 'recompose';




const PopoverConfirmOperation = (props) => {
  const {children, onConfirm, onCancel,isVisible,position} = props;
  /*const popoverContent = (
    <Button onCllick=popoverConfirm> Confirm </Button>
      <Button onCllick=popoverConfirm> Cancel </Button>
      )*/
  return (
    <Popover
      content={
        <div>
          <Button onClick={onConfirm}> Confirm </Button>
          <Button onClick={onCancel}> Cancel </Button>
        </div>
      }
      title="Are you sure ?"
      trigger="click"
      placement={position}
      visible={isVisible}
    >
      {children}

    </Popover>

  )

}

export default PopoverConfirmOperation;
// const mapStateToProps = (state) => ({
//   modal: state.modal
// });

// export default connect(mapStateToProps, { closeModal})(
//   withState('isVisible', 'onPopoverClick', false)(PopoverConfirmOperation)
// );