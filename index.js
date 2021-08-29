const { oldPool, newPool } = require('./database');
const { getOneTableName, getAllTableRows, getAllTableColumns } = require('./database/queries');
const { createReportObject } = require('./utils/createReport');
const { differentColumns } = require('./utils/compareObjects');

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
}

generateReport();
