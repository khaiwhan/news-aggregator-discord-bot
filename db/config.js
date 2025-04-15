require('dotenv').config();

const pgdb = require('pg-promise')({ schema: process.env.DB_SCHEMA });

const db = pgdb({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

db.none(`SET TIME ZONE '${process.env.TZ}'`)

module.exports = { db };