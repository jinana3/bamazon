var mysql = require("mysql");
var inquirer = require("inquirer")
var itemDisplay = [];
var itemArray = [];

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
	menu()
});

function menu(){
	inquirer.prompt([{
		name: "choice",
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}]).then(function(resp) {
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
			switch(resp.choice) {
				case "View Products for Sale":
				view()
				break;

				case "View Low Inventory":
				lowInv()
				break;

				case "Add to Inventory":
				invAdd()
				break;

				case "Add New Product":
				prodAdd()
				break;
			}
		});
	})
}

function view(){
	console.log(JSON.stringify(itemDisplay))
	end()
}

function lowInv(){
	var lowInvArray = []
	for (var i = 0; i < itemArray.length; i++) {
		if (itemArray[i].count < 5) {
			lowInvArray.push(itemArray[i].prod)
		}
	}
	if (lowInvArray.length === 0) {
		console.log("All products above 5 stock")
	}
	else {
		console.log(JSON.stringify(lowInvArray))
	}
	end()
}

function invAdd(){
	inquirer.prompt([{
		name: "choice",
		type: "list",
		message: "What would you like to add inventory to?",
		choices: itemDisplay
	},
	{
		name: "count",
		type: "input",
		message: "Hom many would you like to add?",
		validate: function(value){
			if (isNaN(value) === false) {
				return true
			}
			return false
		}
	}]).then(function(resp) {
		var item = resp.choice;
		var count = parseInt(resp.count);
		var id = itemDisplay.indexOf(item);
		var product = itemArray[id];
		var newAmount = product.count + count
		connection.query(
			"UPDATE products SET ? WHERE ?",
			[
			{
				stock_quantity: newAmount
			},
			{
				item_id: product.id
			}
			],
			function(error) {
				if (error) throw error;
				console.log("Updated successfully!")
				end()
			})
	})
}

function prodAdd() {
	console.log("Add a new item: ")
	inquirer.prompt([{
		name: "name",
		type: "input",
		message: "Name of new product"
	},
	{
		name: "department",
		type: "input",
		message: "Department product belongs in?"
	},
	{
		name: "price",
		type: "input",
		message: "How much does it cost?"
	},
	{
		name: "stock",
		type: "input",
		message: "How much stock do you currently have?"
	}]).then(function(resp) {
		connection.query(
			"INSERT INTO products SET ?",
			{
				product_name: resp.name,
				department_name: resp.department,
				price: resp.price,
				stock_quantity: resp.stock
			},
			function(err) {
				if(err) throw err;
				console.log("New product successfully added")
				end()
			})
	})
}


function end(){
	inquirer.prompt([{
		name: "ending",
		type: "confirm",
		message: "Can I help you with anything else?"
	}]).then(function(resp) {
		if (resp.ending) {
			menu()
		}
		else{
			connection.end()
		}
	})
}