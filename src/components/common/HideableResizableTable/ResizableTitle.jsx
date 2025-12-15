import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { calculateAccurateWidth } from './tableUtils';
import { ThHandle } from './StyledComponents';

const ResizableTitle = ({
  onResize,
  width,
  onDoubleClick,
  setGhostLine,
  ...restProps
}) => {
  const thRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  if (!width) return <th {...restProps} />;

  const handleMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!thRef.current) return;

    startXRef.current = e.clientX;
    startWidthRef.current = thRef.current.offsetWidth;

    setGhostLine(e.clientX, true);

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = moveEvent => {
      setGhostLine(moveEvent.clientX, true);
    };

    const handleMouseUp = upEvent => {
      const diff = upEvent.clientX - startXRef.current;

      const minWidth = calculateAccurateWidth(thRef.current);
      const newWidth = Math.max(minWidth, startWidthRef.current + diff);

      onResize(upEvent, { size: { width: newWidth } });

      setGhostLine(null, false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th ref={thRef} {...restProps} style={{ position: 'relative' }}>
      {restProps.children}
      <ThHandle onMouseDown={handleMouseDown} />
    </th>
  );
};
ResizableTitle.propTypes = {
  onResize: PropTypes.func.isRequired,
  width: PropTypes.number,
  onDoubleClick: PropTypes.func,
  setGhostLine: PropTypes.func.isRequired,
};

export default ResizableTitle;
