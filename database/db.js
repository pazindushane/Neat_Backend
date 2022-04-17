var mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config();

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports=connection;
