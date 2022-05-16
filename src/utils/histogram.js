const numbers = vals => {
  const nums = [];
  if (vals == null) return nums;

  for (let i = 0; i < vals.length; i++) {
    if (this.isNumber(vals[i])) nums.push(+vals[i]);
  }
  return nums;
};

const nsort = vals => vals.sort((a, b) => a - b);

const histogram = (vals, bins) => {
  if (vals == null) {
    return null;
  }
  // eslint-disable-next-line no-param-reassign
  vals = nsort(numbers(vals));
  if (vals.length === 0) {
    return null;
  }
  if (bins == null) {
    // pick bins by simple method: Math.sqrt(n)
    // eslint-disable-next-line no-param-reassign
    bins = Math.sqrt(vals.length);
  }
  // eslint-disable-next-line no-param-reassign
  bins = Math.round(bins);
  if (bins < 1) {
    // eslint-disable-next-line no-param-reassign
    bins = 1;
  }

  let min = vals[0];
  let max = vals[vals.length - 1];
  if (min === max) {
    // fudge for non-variant data
    min -= 0.5;
    max += 0.5;
  }

  const range = max - min;
  // make the bins slightly larger by expanding the range about 10%
  // this helps with dumb floating point stuff
  const tempBinWidth = (range + range * 0.05) / bins;
  const binWidth = Math.round(tempBinWidth);
  const midpoint = (min + max) / 2;
  // even bin count, midpoint makes an edg

  const tempLeftEdge = midpoint - binWidth * Math.floor(bins / 2);
  const leftEdge = Math.round(tempLeftEdge);
  const sections = vals.map(v => v + binWidth).filter(v => v >= leftEdge);
  // if (bins % 2 !== 0) {
  //     // odd bin count, center middle bin on midpoint
  //     var leftEdge = (midpoint - (binWidth / 2)) - (binWidth * Math.floor(bins / 2))
  // }

  const hist = {
    values: Array(bins).fill(0),
    sections,
    bins,
    binWidth,
    binLimits: [leftEdge, leftEdge + binWidth * bins],
  };

  let binIndex = 0;
  for (let i = 0; i < vals.length; i++) {
    while (vals[i] > (binIndex + 1) * binWidth + leftEdge) {
      binIndex++;
    }
    hist.values[binIndex]++;
  }

  return hist;
};

module.exports = histogram;
