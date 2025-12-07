import React from 'react';
import PropTypes from 'prop-types';
import { Resizable } from 'react-resizable';

const ResizableTitle = ({ onResize, width, onDoubleClick, ...restProps }) => {
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          onDoubleClick={e => {
            e.stopPropagation();
            onDoubleClick();
          }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            cursor: 'col-resize',
            background: 'transparent',
            zIndex: 10,
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}>
      <th {...restProps} />
    </Resizable>
  );
};

ResizableTitle.propTypes = {
  onResize: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onDoubleClick: PropTypes.func,
};

export default ResizableTitle;
