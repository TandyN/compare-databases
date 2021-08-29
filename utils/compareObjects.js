const ifObjectsContainSameContent = (obj1, obj2) => {
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};

const differentColumns = (oldDBColumns, newDBColumns) => {
  return newDBColumns.filter(x => oldDBColumns.indexOf(x) === -1);
}

module.exports = {
  ifObjectsContainSameContent,
  differentColumns,
};
