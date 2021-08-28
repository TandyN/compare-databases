const getAllTableNames = async (pool) => {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE';
  `);

  return result.rows[0];
}

module.exports = {
  getAllTableNames,
};
