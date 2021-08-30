const obj1SubsetOfObj2 = (obj1, obj2) => {
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
  obj1SubsetOfObj2,
  differentColumns,
};
