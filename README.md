# compare-databases

> This program is designed to generate a report on any missing, corrupted, and/or new records comparing an old Postgres 13 database to new one.

## Scenario

You recently migrated data from one database to another. You need to identify if there are any missing, corrupted, and/or new records.

### Assumptions

- If a primary key found in the new database shares a primary key in the old database, you can assume they refer to the same entity (primary keys were not corrupted during the migration).
- If two records sharing the same primary key have different data in any **shared** column, you can assume that record was **corrupted** by the migration.
- If you find a record in the old database that is not found in the new database, you can assume that record was **missed** during the migration.
- If you find a record in the new database that was not found in the old database, you can assume that record was **newly created** since the migration.
- All columns in the old database exist in the new database.
- There is only 1 table in both databases.
- There are not more than 100,000 records in each database.

## Requirements

Below are a list of environmental requirements to run this program.

- Node.js (*developed using Node v14.15.4*)
- PostgreSQL (*developed using PostgreSQL 13*)
