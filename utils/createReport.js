const addToCorrupt = (objReport, objCorruptValues, objActualValues, primaryKey) => {
  objReport.corrupt[primaryKey] = {
    corruptValues: objCorruptValues,
    actualValues: objActualValues,
  };
};

const addToMissing = (objReport, objMain, primaryKey) => {
  objReport.missing[primaryKey] = objMain[primaryKey];
};

module.exports = {
  addToCorrupt,
  addToMissing,
};
