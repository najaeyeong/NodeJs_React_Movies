require("dotenv").config();

const host = process.env.host;
const port = process.env.port;
const user = process.env.user;
const password = process.env.password;
const database  = process.env.database;

module.exports = {host, port, user, password, database};
