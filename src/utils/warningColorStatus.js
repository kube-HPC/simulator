const mapBySize = node => node.size;
const sumArr = (total, curr) => total + curr;
const flatAllStats = nodeArr => nodeArr.map(mapBySize);
const flatByFree = nodeArr => nodeArr.filter(node => node.name === 'free').map(mapBySize);

export const getColorStatus = stats => {
  if (!(stats && stats.results)) {
    return '';
  }
  const { results } = stats;
  const algorithmsDataArr = results.map(r => r.algorithmsData);
  const totalSize = algorithmsDataArr.flatMap(flatAllStats).reduce(sumArr, 0);
  const freeSize = algorithmsDataArr.flatMap(flatByFree).reduce(sumArr, 0);

  const freePresents = freeSize / totalSize;
  const isWarningStatus = 0 < freePresents && freePresents <= 0.15;
  const isErrorStatus = freePresents === 0;

  return { status: isWarningStatus ? 'warning' : isErrorStatus ? 'error' : '', total: totalSize };
};

export const getDiskSpaceColorStatus = diskSpace => {
  let status = '';
  if (!diskSpace) {
    return { status };
  }
  const { size, free } = diskSpace;
  const percent = (free / size) * 100;
  if (percent > 10 && percent < 20) {
    status = 'warning';
  } else if (percent <= 10) {
    status = 'error';
  }
  return { status, size, free };
};