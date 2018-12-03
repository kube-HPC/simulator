import { Icon, Button } from 'antd';

// TODO: Not used, check how to fix rendering position
const AddButton = ({ onVisible }) => (
  <div>
    <Button
          type="primary" shape="circle" size="default"
          style={{
            textAlign: 'center',
            position: 'absolute',
            width: '56px',
            height: '56px',
            top: '90%',
            right: '3%',
            boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)'
          }} onClick={onVisible}>
        <Icon type="plus" width="24px" height="24px" style={{ margin: 'auto', fontSize: 'x-large' }}/>
      </Button>
  </div>
);

AddButton.propTypes = {
  onVisible: React.PropTypes.func.isRequired
};

export default AddButton;
