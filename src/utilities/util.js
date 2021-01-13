export const sortData = (data, item) => {
  const sortedData = [...data];
  switch (item) {
    case "recovered":
      sortedData.sort((a, b) => {
        if (a.recovered > b.recovered) {
          return -1;
        } else {
          return 1;
        }
      });
      break;
    case "critical":
      sortedData.sort((a, b) => {
        if (a.critical > b.critical) {
          return -1;
        } else {
          return 1;
        }
      });
      break;
    case "active":
      sortedData.sort((a, b) => {
        if (a.active > b.active) {
          return -1;
        } else {
          return 1;
        }
      });
      break;
    case "deaths":
      sortedData.sort((a, b) => {
        if (a.deaths > b.deaths) {
          return -1;
        } else {
          return 1;
        }
      });
      break;
    default:
      sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
          return -1;
        } else {
          return 1;
        }
      });
  }
  return sortedData;
};
