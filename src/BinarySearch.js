export default function BinarySearch (list = [], value = 0) {
  let start = 0,
    end = list.length - 1,
    midIdx = null;

  while (start <= end) {
    midIdx = Math.floor((start + end) / 2);
    let midItem = list[midIdx];
    if (midItem.bottom * 1 === value * 1) return value;
    if (midItem.bottom < value) start = midIdx + 1;
    else end = midIdx - 1;
  }
  return midIdx;
}