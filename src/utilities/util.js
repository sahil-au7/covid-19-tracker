export const sortData = (data, item) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a[item] > b[item]) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};
