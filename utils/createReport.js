const addToCorrupt = (objReport, objCorruptValues, objActualValues, primaryKey) => {
  objReport.corrupt[primaryKey] = {
    corruptValues: objCorruptValues,
    actualValues: objActualValues,
  };
}

module.exports = {
  addToCorrupt
};
