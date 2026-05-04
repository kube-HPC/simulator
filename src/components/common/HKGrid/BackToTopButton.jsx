import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const DEFAULT_ROW_THRESHOLD = 3;

const getFirstDisplayedRow = api => {
  if (!api) {
    return -1;
  }

  if (typeof api.getFirstDisplayedRowIndex === 'function') {
    return api.getFirstDisplayedRowIndex();
  }

  if (typeof api.getFirstDisplayedRow === 'function') {
    return api.getFirstDisplayedRow();
  }

  return -1;
};

const BackToTopButton = ({
  gridApi,
  rowData,
  rowThreshold = DEFAULT_ROW_THRESHOLD,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const updateVisibility = useCallback(() => {
    if (!gridApi) {
      setShowBackToTop(false);
      return;
    }

    const firstDisplayedRow = getFirstDisplayedRow(gridApi);
    const displayedRowsCount = gridApi.getDisplayedRowCount();

    setShowBackToTop(
      displayedRowsCount > rowThreshold && firstDisplayedRow >= rowThreshold
    );
  }, [gridApi, rowThreshold]);

  const onBackToTop = () => {
    if (!gridApi) {
      return;
    }

    gridApi.ensureIndexVisible(0, 'top');
    setShowBackToTop(false);
  };

  useEffect(() => {
    if (!gridApi) {
      setShowBackToTop(false);
      return undefined;
    }

    gridApi.addEventListener('bodyScroll', updateVisibility);
    gridApi.addEventListener('modelUpdated', updateVisibility);
    gridApi.addEventListener('firstDataRendered', updateVisibility);

    updateVisibility();

    return () => {
      gridApi.removeEventListener('bodyScroll', updateVisibility);
      gridApi.removeEventListener('modelUpdated', updateVisibility);
      gridApi.removeEventListener('firstDataRendered', updateVisibility);
    };
  }, [gridApi, updateVisibility]);

  useEffect(() => {
    updateVisibility();
  }, [rowData, updateVisibility]);

  if (!showBackToTop) {
    return null;
  }

  return (
    <FloatButton
      onClick={onBackToTop}
      style={{ opacity: '0.7', marginRight: '70px' }}
      type="primary"
      shape="circle"
      size="large"
      icon={<ArrowUpOutlined />}
    />
  );
};

BackToTopButton.propTypes = {
  gridApi: PropTypes.object,
  rowData: PropTypes.array,
  rowThreshold: PropTypes.number,
};

BackToTopButton.defaultProps = {
  gridApi: null,
  rowData: [],
  rowThreshold: DEFAULT_ROW_THRESHOLD,
};

export default BackToTopButton;
