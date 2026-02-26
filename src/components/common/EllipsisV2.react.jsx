import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const { Text } = Typography;

const RESERVED_CHARS = 5;
const ELLIPSIS = '...';

const EllipsisV2 = ({
  text = '',
  copyable = false,
  ellipsis = true,
  children = '',
  viewDisplayLine = 'block',
  style = {},
  length,
  showTooltip = true,
  isMeasurement = true,
  ...props
}) => {
  const textRef = useRef(null);
  const sourceText = useMemo(() => {
    if (typeof text === 'string' && text.length > 0) {
      return text;
    }

    return typeof children === 'string' ? children : '';
  }, [children, text]);

  const [displayText, setDisplayText] = useState(
    ellipsis && isMeasurement ? '' : sourceText
  );
  const [isTruncated, setIsTruncated] = useState(false);

  const calculateTextByParent = useCallback(() => {
    const element = textRef.current;
    const parent = element?.parentElement;

    if (!ellipsis || !isMeasurement || !sourceText) {
      setDisplayText(sourceText);
      setIsTruncated(false);
      return;
    }

    if (!parent) {
      setDisplayText(sourceText);
      setIsTruncated(false);
      return;
    }

    const parentWidth = parent.clientWidth;
    if (!parentWidth) {
      setDisplayText('');
      setIsTruncated(false);
      return;
    }

    const fontSize = parseFloat(
      window.getComputedStyle(element).fontSize || '14'
    );
    const avgCharWidth = Math.max(6, fontSize * 0.55);

    const maxChars = Math.max(
      0,
      Math.floor(parentWidth / avgCharWidth) - RESERVED_CHARS
    );

    if (!maxChars || sourceText.length <= maxChars) {
      setDisplayText(sourceText);
      setIsTruncated(false);
      return;
    }

    setDisplayText(`${sourceText.slice(0, maxChars)}${ELLIPSIS}`);
    setIsTruncated(true);
  }, [ellipsis, isMeasurement, sourceText]);

  useLayoutEffect(() => {
    calculateTextByParent();
  }, [calculateTextByParent]);

  useEffect(() => {
    const element = textRef.current;
    const parent = element?.parentElement;

    if (!element) {
      return undefined;
    }

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', calculateTextByParent);
      return () => window.removeEventListener('resize', calculateTextByParent);
    }

    const observer = new ResizeObserver(() => {
      calculateTextByParent();
    });

    observer.observe(element);
    if (parent) {
      observer.observe(parent);
    }

    window.addEventListener('resize', calculateTextByParent);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateTextByParent);
    };
  }, [calculateTextByParent]);

  const content = sourceText ? displayText : children;
  const tooltipTitle = copyable ? 'Click to copy' : sourceText || children;
  const shouldShowTooltip = showTooltip && (copyable || isTruncated);

  const clickableTextStyle = {
    cursor: copyable ? 'pointer' : 'default',
    display: 'inline-block',
    maxWidth: '100%',
    minWidth: 0,
    whiteSpace: ellipsis ? 'nowrap' : 'normal',
    overflow: 'hidden',
    textOverflow: ellipsis ? 'ellipsis' : 'visible',
    verticalAlign: 'bottom',
  };

  const clickableTextNode = copyable ? (
    <button
      type="button"
      onClick={() => copyToClipboard(sourceText || '')}
      style={{
        ...clickableTextStyle,
        border: 0,
        background: 'transparent',
        padding: 0,
        margin: 0,
        textAlign: 'inherit',
        font: 'inherit',
        color: 'inherit',
      }}>
      {content}
    </button>
  ) : (
    <span style={clickableTextStyle}>{content}</span>
  );

  const textWithOptionalTooltip = shouldShowTooltip ? (
    <Tooltip title={tooltipTitle} placement="top">
      {clickableTextNode}
    </Tooltip>
  ) : (
    clickableTextNode
  );

  const textNode = (
    <Text
      ref={textRef}
      style={{
        cursor: 'default',
        lineHeight: '2',
        whiteSpace: ellipsis ? 'nowrap' : 'normal',
        overflow: 'hidden',
        display: viewDisplayLine,
        width: length ? `${length * 5}px` : '100%',
        maxWidth: '100%',
        minWidth: 0,
        textOverflow: ellipsis ? 'ellipsis' : 'visible',
        visibility: sourceText && !displayText ? 'hidden' : 'visible',
        ...style,
      }}
      {...props}>
      {textWithOptionalTooltip}
    </Text>
  );

  return textNode;
};

EllipsisV2.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  length: PropTypes.number,
  copyable: PropTypes.bool,
  ellipsis: PropTypes.bool,
  viewDisplayLine: PropTypes.string,
  style: PropTypes.object,
  showTooltip: PropTypes.bool,
  isMeasurement: PropTypes.bool,
};

export default EllipsisV2;
