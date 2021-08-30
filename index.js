const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { oldPool, newPool } = require('./database');
const { getTableName, getAllTableRows, getAllTableColumns } = require('./database/queries');
const { createReportObject } = require('./utils/createReport');
const { differentColumns } = require('./utils/compareObjects');
const { convertObjectToArrayOfObjects } = require('./utils/modifyObjects');
const { convertArrayToObjectWithKeys } = require('./utils/modifyObjects');

const generateReport = async () => {
  const oldDBTableName = await getTableName(oldPool);
  const newDBTableName = await getTableName(newPool);

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

  await missingRecordsWriter.writeRecords(missingRecordsArray);
  await corruptRecordsWriter.writeRecords(corruptRecordsArray);
  await newRecordsWriter.writeRecords(newRecordsArray);

  console.log('Successfully created all reports which can be found in the /reports folder');
}

generateReport();
