require('dotenv').config();
const { Pool } = require('pg');

const oldPool = new Pool({
  user: process.env.PG1_USER,
  host: process.env.PG1_HOST,
  database: process.env.PG1_DATABASE,
  password: process.env.PG1_PASSWORD,
  port: process.env.PG1_PORT,
});

oldPool.query(`SELECT NOW()`, (err, res) => {
  if (err) console.log(err);
  else console.log('Connected to old database');
});

const newPool = new Pool({
  user: process.env.PG2_USER,
  host: process.env.PG2_HOST,
  database: process.env.PG2_DATABASE,
  password: process.env.PG2_PASSWORD,
  port: process.env.PG2_PORT,
});

newPool.query(`SELECT NOW()`, (err, res) => {
  if (err) console.log(err);
  else console.log('Connected to new database');
});

module.exports = {
  oldPool,
  newPool,
};
