const { ifObjectsContainSameContent } = require('./compareObjects');

const addToCorrupt = (objReport, objCorruptValues, objActualValues, primaryKey) => {
  objReport.corrupt[primaryKey] = {
    corruptValues: objCorruptValues,
    actualValues: objActualValues,
  };
};

const addToMissing = (objReport, objMain, primaryKey) => {
  objReport.missing[primaryKey] = objMain[primaryKey];
};

const createReportObject = (oldDBObject, newDBObject) => {
  const reportObject = {
    corrupt: {},
    missing: {},
    new: {},
  }

  for (let primaryKey in oldDBObject) {
    if (newDBObject[primaryKey]) {
      if (!ifObjectsContainSameContent(oldDBObject[primaryKey], newDBObject[primaryKey])) {
        const corruptValues = {};
        const actualValues = {};

        for (let field in oldDBObject[primaryKey]) {
          if (oldDBObject[primaryKey][field] !== newDBObject[primaryKey][field]) {
            corruptValues[field] = newDBObject[primaryKey][field];
            actualValues[field] = oldDBObject[primaryKey][field];
          }
        }
        addToCorrupt(reportObject, corruptValues, actualValues, primaryKey);
      }
      delete newDBObject[primaryKey];
    } else {
      addToMissing(reportObject, oldDBObject, primaryKey)
    }
  }

  reportObject.new = { ...newDBObject };

  return reportObject;
};

module.exports = {
  addToCorrupt,
  addToMissing,
  createReportObject,
};
