const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { oldPool, newPool } = require('./database');
const { getOneTableName, getAllTableRows, getAllTableColumns } = require('./database/queries');
const { createReportObject } = require('./utils/createReport');
const { differentColumns } = require('./utils/compareObjects');
const { convertObjectToArrayOfObjects } = require('./utils/modifyObjects');
const { convertArrayToObjectWithKeys } = require('./utils/modifyObjects');

const generateReport = async () => {
  const oldDBTableName = await getOneTableName(oldPool);
  const newDBTableName = await getOneTableName(newPool);

  const oldTableColumns = await getAllTableColumns(oldPool, oldDBTableName.table_name);
  const newTableColumns = await getAllTableColumns(newPool, newDBTableName.table_name);

  const differentTableColumns = differentColumns(oldTableColumns, newTableColumns);

  const oldDBRows = await getAllTableRows(oldPool, oldDBTableName.table_name);
  const newDBRows = await getAllTableRows(newPool, newDBTableName.table_name);

  await oldPool.end();
  await newPool.end();

  const modifiedOldDBRows = convertArrayToObjectWithKeys(oldDBRows, 'id');
  const modifiedNewDBRows = convertArrayToObjectWithKeys(newDBRows, 'id');

  const reportObject = createReportObject(modifiedOldDBRows, modifiedNewDBRows, differentTableColumns);

  const missingRecordsArray = convertObjectToArrayOfObjects(reportObject.missing, 'id');
  const corruptRecordsArray = convertObjectToArrayOfObjects(reportObject.corrupt, 'id');
  const newRecordsArray = convertObjectToArrayOfObjects(reportObject.new, 'id');

  const missingRecordsWriter = createCsvWriter({
    path: './reports/MissingRecords.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'email', title: 'email' },
    ],
  });

  const corruptRecordsWriter = createCsvWriter({
    path: './reports/CorruptRecords.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'email', title: 'email' },
      { id: 'favorite_flavor', title: 'favorite_flavor' },
    ],
  });

  const newRecordsWriter = createCsvWriter({
    path: './reports/NewRecords.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'email', title: 'email' },
      { id: 'favorite_flavor', title: 'favorite_flavor' },
    ],
  });

  if (!fs.existsSync('./reports')) {
    fs.mkdirSync('./reports');
  }

  missingRecordsWriter.writeRecords(missingRecordsArray)
    .then(() => {
      console.log('MissingRecords.csv Generated in reports folder');
    });

  corruptRecordsWriter.writeRecords(corruptRecordsArray)
    .then(() => {
      console.log('CorruptRecords.csv Generated in reports folder');
    });

  newRecordsWriter.writeRecords(newRecordsArray)
    .then(() => {
      console.log('NewRecords.csv Generated in reports folder');
    });
}

generateReport();
