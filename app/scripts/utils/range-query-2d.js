import { addArrays, accessorTransposition } from '.';

/**
 * Perform a 2D query on a 1D array
 *
 * @param  {Array}  src  Data source array.
 * @param  {Integer}  xDimSrc  X dimension of `src`.
 * @param  {Integer}  xDimOut  X dimension of `outList`.
 * @param  {Array}  xRange  X range array, e.g., `[start, end]`.
 * @param  {Array}  yRange  Y range array, e.g., `[start, end]`.
 * @param  {Boolean}  mirrored  If `true` mirror query.
 * @param  {Integer}  xOff  X offset in regards to `outList`.
 * @param  {Integer}  yOff  Y offset in regards to `outList`.
 * @param  {Array}  outList  Typed array to be set in place.
 * @return  {Array}  Sub array.
 */
const rangeQuery2d = (
  src, xDimSrc, xDimOut, xRange, yRange, mirrored, xOff = 0, yOff = 0, outList
) => {
  const _xRange = mirrored ? yRange : xRange;
  const _yRange = mirrored ? xRange : yRange;
  const _xOff = mirrored ? yOff : xOff;
  const _yOff = mirrored ? xOff : yOff;

  const xFrom = Math.max(0, +_xRange[0] || 0);
  const xTo = Math.max(0, +_xRange[1] || 0);
  const yFrom = Math.max(0, +_yRange[0] || 0);
  const yTo = Math.max(0, +_yRange[1] || 0);

  let subList = [];

  if (ArrayBuffer.isView(outList)) {
    const newList = new outList.constructor(outList.length);
    let c = 0 + _yOff;
    for (let i = yFrom; i < yTo; i++) {
      newList.set(
        src.slice((i * xDimSrc) + xFrom, (i * xDimSrc) + xTo),
        _xOff + (c * xDimOut)
      );
      c += 1;
    }
    const acc = mirrored
      ? accessorTransposition(xDimOut, xDimOut) : undefined;
    subList = addArrays(outList, newList, acc);
  } else {
    for (let i = yFrom; i < yTo; i++) {
      subList.push(...src.slice((i * xDimSrc) + xFrom, (i * xDimSrc) + xTo));
    }
  }

  return subList;
};

export default rangeQuery2d;
