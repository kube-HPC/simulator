import { useState, useRef, useCallback, useEffect } from 'react';
import {
  DEFAULT_TRACE_ROW_HEIGHT,
  MIN_TRACE_ROW_HEIGHT,
  MAX_TRACE_ROW_HEIGHT,
} from './traceConstants';

const clampRowHeight = nextHeight =>
  Math.max(MIN_TRACE_ROW_HEIGHT, Math.min(MAX_TRACE_ROW_HEIGHT, nextHeight));

export const useTraceRowHeight = () => {
  const [rowHeight, setRowHeight] = useState(DEFAULT_TRACE_ROW_HEIGHT);

  const onRowHeightChange = useCallback(nextHeight => {
    setRowHeight(clampRowHeight(nextHeight));
  }, []);

  return {
    rowHeight,
    onRowHeightChange,
  };
};

export const useTraceRowResize = ({ rowHeight, onRowHeightChange }) => {
  const resizeStateRef = useRef({ startY: 0, startHeight: rowHeight });

  const onRowResize = useCallback(
    event => {
      const delta = event.clientY - resizeStateRef.current.startY;
      onRowHeightChange(resizeStateRef.current.startHeight + delta);
    },
    [onRowHeightChange]
  );

  const stopRowResize = useCallback(() => {
    window.removeEventListener('mousemove', onRowResize);
    window.removeEventListener('mouseup', stopRowResize);
  }, [onRowResize]);

  const startRowResize = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      resizeStateRef.current = {
        startY: event.clientY,
        startHeight: rowHeight,
      };
      window.addEventListener('mousemove', onRowResize);
      window.addEventListener('mouseup', stopRowResize);
    },
    [onRowResize, rowHeight, stopRowResize]
  );

  useEffect(
    () => () => {
      window.removeEventListener('mousemove', onRowResize);
      window.removeEventListener('mouseup', stopRowResize);
    },
    [onRowResize, stopRowResize]
  );

  return {
    startRowResize,
  };
};
