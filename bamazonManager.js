//install dependencies
var mysql = require("mysql");
var inquirer = require("inquirer")

//make sql connection (see activity 13)
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "", //password
	database: "bamazon_db"
});
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	run(); //activity 13 puts a callback function here, if no error then run program
});