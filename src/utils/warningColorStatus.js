const mapBySize = node => node.size;
const sumArr = (total, curr) => total + curr;
const flatAllStats = nodeArr => nodeArr.map(mapBySize);
const flatByFree = nodeArr =>
  nodeArr.filter(node => node.name === 'free').map(mapBySize);

export const getColorStatus = stats => {
  if (!(stats && stats.results)) {
    return '';
  }
  const { results } = stats;
  const algorithmsDataArr = results.map(r => r.algorithmsData);
  const totalSize = algorithmsDataArr.flatMap(flatAllStats).reduce(sumArr, 0);
  const freeSize = algorithmsDataArr.flatMap(flatByFree).reduce(sumArr, 0);
  const freePercentage = freeSize / totalSize;

  const isWarningStatus = freePercentage > 0 && freePercentage <= 0.15;
  const isErrorStatus = freePercentage === 0;

  return {
    status: isWarningStatus ? 'warning' : isErrorStatus ? 'error' : '',
    total: totalSize,
  };
};

export const getStorageColorStatus = storage => {
  let status = '';
  if (!storage) {
    return { status };
  }
  const { size, free } = storage;
  const percent = (free / size) * 100;
  if (percent > 10 && percent < 20) {
    status = 'warning';
  } else if (percent <= 10) {
    status = 'error';
  }
  return { status, size, free };
};

export const combineStatus = (a, b) => {
  const statuses = [a.status, b.status];
  const status = statuses.includes('error')
    ? 'error'
    : statuses.includes('warning')
    ? 'warning'
    : b.status || a.status;
  return {
    ...a,
    ...b,
    status,
  };
};
