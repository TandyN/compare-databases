const getTableName = async (pool) => {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE';
  `);

  return result.rows[0];
};

const getAllTableRows = async (pool, tableName) => {
  const result = await pool.query(`
    SELECT *
    FROM ${tableName};
  `);

  return result.rows;
};

const getAllTableColumns = async (pool, tableName) => {
  const result = await pool.query(`
    SELECT *
    FROM information_schema.columns
    WHERE table_name='${tableName}';
  `);

  return result.rows.map(row => row.column_name);
};

module.exports = {
  getTableName,
  getAllTableRows,
  getAllTableColumns,
};
