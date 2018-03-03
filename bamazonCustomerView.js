var mysql = require("mysql");
var inquirer = require("inquirer")
var itemDisplay = [];
var itemArray = [];
var difference;
var product
var item;
var count;
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "", //password
	database: "bamazon"
});
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	run()
});

function run(){
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		for (var i = 0; i < results.length; i++) {
			var item = {
				id: results[i].item_id,
				prod: results[i].product_name,
				dep: results[i].department_name,
				price: results[i].price,
				count: results[i].stock_quantity
			}
			itemArray.push(item)
			var itemString = "ID: "+item.id+" --- "+"Product: "+item.prod+" --- "+"Department: "+item.dep+" --- "+"Price: "+item.price
			itemDisplay.push(itemString);
		}
		prompt();
	})
}

function prompt(){
	inquirer.prompt([{
		name: "choice",
		type: "list",
		message: "What would you like to purchase?",
		choices: itemDisplay
	},
	{
		name: "count",
		type: "input",
		message: "Hom many would you like?",
		validate: function(value){
			if (isNaN(value) === false) {
				return true
			}
			return false
		}
	}]).then(function(resp) {
		item = resp.choice;
		count = parseInt(resp.count);
		var id = itemDisplay.indexOf(item)
		product = itemArray[id]
		if (product.count < count) {
			console.log("Sorry, there are only, "+product.count+" left")
			prompt()
		}
		else {
			difference = product.count-count
			var price = count*product.price
			console.log("That will be $"+price+" please.")
			update()
		}
	});
}

function update() {
	connection.query(
		"UPDATE products SET ? WHERE ?",
		[
		{
			stock_quantity: difference
		},
		{
			item_id: product.id
		}
		],
		function(error) {
			if (error) throw err;
			console.log("Purchase successful!!")

			inquirer.prompt([{
				name: "end",
				type: "confirm",
				message: "Can I help you with anything else?"
			}]).then(function(resp) {
				if (resp.end) {
					run()
				}
				else{
					connection.end()
				}
			})
		})
}