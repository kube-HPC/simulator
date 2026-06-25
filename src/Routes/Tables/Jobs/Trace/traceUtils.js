import { getSystemColors } from './traceConstants';

export const formatDuration = microseconds => {
  if (microseconds < 1000) return `${microseconds}μs`;
  if (microseconds < 1000000) return `${(microseconds / 1000).toFixed(2)}ms`;
  return `${(microseconds / 1000000).toFixed(2)}s`;
};

export const formatTime = (microseconds, startTime) => {
  const relativeMs = (microseconds - startTime) / 1000;
  if (relativeMs < 1000) return `${relativeMs.toFixed(2)}ms`;
  return `${(relativeMs / 1000).toFixed(2)}s`;
};

export const formatDateTime = timestamp => {
  const date = new Date(timestamp / 1000);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const generateServiceColor = (serviceName, isDark = false) => {
  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = serviceName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  if (isDark) {
    // Dark mode: High contrast, vibrant colors
    const saturation = 70 + (Math.abs(hash >> 8) % 20); // 70-90%
    const lightness = 58 + (Math.abs(hash >> 16) % 17); // 58-75%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  // Light mode: Softer, pastel colors
  const saturation = 50 + (Math.abs(hash >> 8) % 30); // 50-80%
  const lightness = 65 + (Math.abs(hash >> 16) % 20); // 65-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
export const getContrastTextColor = backgroundColor => {
  let r;
  let g;
  let b;

  if (backgroundColor.startsWith('hsl')) {
    // Convert HSL to RGB first (we'll use a simpler approach)
    // For HSL colors, we can check the lightness value directly
    const lightnessMatch = backgroundColor.match(
      /hsl\(\d+,\s*\d+%,\s*(\d+)%\)/
    );
    if (lightnessMatch) {
      const lightness = parseInt(lightnessMatch[1], 10);

      return lightness > 60 ? '#424040' : '#ffffff';
    }
  }

  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.replace('#', '');
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (backgroundColor.startsWith('rgb')) {
    const matches = backgroundColor.match(/\d+/g);
    if (matches) {
      r = parseInt(matches[0], 10);
      g = parseInt(matches[1], 10);
      b = parseInt(matches[2], 10);
    }
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

export const getServiceColor = (serviceName, isDark = false) => {
  const colors = getSystemColors(isDark);
  return (
    colors.services[serviceName] || generateServiceColor(serviceName, isDark)
  );
};

export const hasError = span =>
  span.tags?.some(
    tag =>
      (tag.key === 'error' && tag.value === true) ||
      (tag.key === 'http.status_code' && tag.value >= 400)
  );

export const buildSubtreeData = (data, rootSpanId) => {
  if (!data?.spans || !rootSpanId) {
    return data;
  }

  const rootSpan = data.spans.find(span => span.spanID === rootSpanId);
  if (!rootSpan) {
    return data;
  }

  const childrenByParent = new Map();
  data.spans.forEach(span => {
    span.references?.forEach(ref => {
      if (ref.refType !== 'CHILD_OF') {
        return;
      }
      if (!childrenByParent.has(ref.spanID)) {
        childrenByParent.set(ref.spanID, []);
      }
      childrenByParent.get(ref.spanID).push(span.spanID);
    });
  });

  const includedIds = new Set([rootSpanId]);
  const stack = [rootSpanId];

  while (stack.length > 0) {
    const currentId = stack.pop();
    const children = childrenByParent.get(currentId) || [];
    children.forEach(childId => {
      if (includedIds.has(childId)) {
        return;
      }
      includedIds.add(childId);
      stack.push(childId);
    });
  }

  const rootRelativeStart = rootSpan.relativeStartTime || 0;
  const subtreeSpans = data.spans
    .filter(span => includedIds.has(span.spanID))
    .map(span => ({
      ...span,
      relativeStartTime: Math.max(
        0,
        span.relativeStartTime - rootRelativeStart
      ),
    }));

  return {
    ...data,
    spans: subtreeSpans,
    startTime: rootSpan.startTime,
    duration: rootSpan.duration,
  };
};
