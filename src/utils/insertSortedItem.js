/**
 * Inserts an item into a sorted array by a specified numeric key while preserving order.
 *
 * @template T
 * @param {Array<T>} array - The original array (assumed to be already sorted).
 * @param {T} newItem - The new item to insert.
 * @param {keyof T} key - The key of the numeric field used for sorting.
 * @returns {Array<T>} - A new array with the item inserted in order.
 *
 */
export default function insertSortedItem(array, newItem, key) {
  const newArray = [...array];
  const newValue = newItem[key];

  let left = 0;
  let right = newArray.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (newArray[mid][key] < newValue) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  newArray.splice(left, 0, newItem);
  return newArray;
}
