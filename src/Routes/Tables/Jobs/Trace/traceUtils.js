import { systemColors } from './traceConstants';

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

// Generate random pastel/mid-tone color
const generateServiceColor = serviceName => {
  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = serviceName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = 45 + (Math.abs(hash >> 8) % 40);
  const lightness = 55 + (Math.abs(hash >> 16) % 25);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getServiceColor = serviceName => (
    systemColors.services[serviceName] || generateServiceColor(serviceName)
  );

export const hasError = span => span.tags?.some(
    tag =>
      (tag.key === 'error' && tag.value === true) ||
      (tag.key === 'http.status_code' && tag.value >= 400)
  );
