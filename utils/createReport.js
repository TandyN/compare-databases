const { obj1SubsetOfObj2 } = require('./compareObjects');

const addToCorrupt = (objReport, oldDBObject, newDBObject, primaryKey, differentColumns) => {
  objReport.corrupt[primaryKey] = { ...oldDBObject[primaryKey] };

  differentColumns.forEach((colName) => {
    objReport.corrupt[primaryKey][colName] = newDBObject[primaryKey][colName];
  });
};

const addToMissing = (objReport, objMain, primaryKey) => {
  objReport.missing[primaryKey] = objMain[primaryKey];
};

const createReportObject = (oldDBObject, newDBObject, differentColumns = []) => {
  const reportObject = {
    corrupt: {},
    missing: {},
    new: {},
  }

  for (let primaryKey in oldDBObject) {
    if (newDBObject[primaryKey]) {
      if (!obj1SubsetOfObj2(oldDBObject[primaryKey], newDBObject[primaryKey])) {
        addToCorrupt(reportObject, oldDBObject, newDBObject, primaryKey, differentColumns);
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
