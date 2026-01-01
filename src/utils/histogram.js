import isNumber from 'isnumber';

const numbers = vals => {
  const nums = [];
  if (vals == null) return nums;

  for (let i = 0; i < vals.length; i++) {
    if (isNumber(vals[i])) nums.push(+vals[i]);
  }
  return nums;
};

const nsort = vals => vals.sort((a, b) => a - b);

const histogram = (vals, bins) => {
  if (vals == null) return null;

  const sortedVals = nsort(numbers(vals));
  if (sortedVals.length === 0) return null;

  const binsCount =
    bins == null
      ? Math.max(1, Math.round(Math.sqrt(sortedVals.length)))
      : Math.max(1, Math.round(bins));

  let min = sortedVals[0];
  let max = sortedVals[sortedVals.length - 1];
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }

  const range = max - min;
  const binWidth = Math.round((range * 1.05) / binsCount);
  const midpoint = (min + max) / 2;
  const leftEdge = Math.round(midpoint - binWidth * Math.floor(binsCount / 2));

  const sections = Array(binsCount)
    .fill()
    .map((_, i) => (i + 1) * binWidth + leftEdge);

  const hist = {
    values: Array(binsCount).fill(0),
    sections,
    bins: binsCount,
    binWidth,
    binLimits: [leftEdge, leftEdge + binWidth * binsCount],
  };

  let binIndex = 0;
  for (let i = 0; i < sortedVals.length; i++) {
    while (sortedVals[i] > (binIndex + 1) * binWidth + leftEdge) {
      binIndex++;
    }
    hist.values[binIndex]++;
  }

  return hist;
};

export default histogram;
