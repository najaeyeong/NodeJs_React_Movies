const mysql = require('mysql');

const db = mysql.createConnection({
    host     : "localhost",
    user     : "nah0101" ,
    port: 3306,
    password : 'cjdruf0984~',
    database : 'crud',
    insecureAuth: true,
    dateStrings:"date" // mysql 에서 시간 갖어올때 
});

db.connect();

module.exports = db;
