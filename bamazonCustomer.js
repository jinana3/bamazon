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

//this function takes in a product object and parses it so it's displayed nicely as console log
var display = function(product){
	if (product.quant === 0){
		var log = "Item ID: " + product.item + 
					" || Product Name: " + product.product + " is out of stock right now!";
	}
	else{
		var log = "Item ID: " + product.item + 
					" || Product Name: " + product.product +
					" || Department Name: " + product.department +
					" || Price: " + product.price;
		}
	return console.log(log);
}

//stores array of product objects
var productArr = [];

//first display all items avaliable for sale
var run = function(){
	var query = "SELECT * FROM products";
	connection.query(query, function(err, results) {
		if (err) throw err;
		for (var i = 0; i < results.length; i++) {
			//build an object for each record and store in an array
			var product = {
				item: results[i].item_id,
				product: results[i].product_name,
				department: results[i].product_name,
				price: results[i].price,
				quant: results[i].stock_quantity
			}
			productArr.push(product);
			display(product);
		}
		prompt(); //after display should prompt user
	})
}

// prompt commands for purchase
function prompt(){
	inquirer.prompt([{
		name: "buy_item",
		type: "input",
		message: "What would you like to purchase? (Type in Item ID)",
		validate: function(val){//http://simiansblog.com/2015/05/06/Using-Inquirer-js/
			if (isNaN(val) === false){
				return true
			}
			return false
		}
	},
	{
		name: "buy_quant",
		type: "input",
		message: "Hom many would you like?",
		validate: function(val){ //or can read https://www.npmjs.com/package/inquirer
			if (isNaN(val) === false) {
				return true
			}
			return false
		}
	}]).then(function(res) {
		var item = parseInt(res.buy_item); //user inputted item id: assumption that database will not change item id
		var quant = parseInt(res.buy_quant); //user will give quantity
		var product = productArr[item-1]; //get the product from the stored array list
		// this is instead of doing another query call to database, which probably is best if database is really large; don't want to be storing everything in js meomry
		if (quant > product.quant) {
			console.log("Not enough items in stock; there are only "+product.quant+" left!");
			console.log("Please re-select: ");
			prompt(); //user will have to re-select what and how many they will buy
		}
		else {
			display(product);
			var total = quant*product.price;
			console.log("your total comes to $"+total);

			inquirer.prompt([{
				name: "confirm",
				type: "confirm",
				message: "Confirm purchase?",
				default: true
			}]).then(function(res){
				if (res.confirm){
					var left = product.quant - quant;
					console.log("Purchase successful!!");
					inventory(item, left);
				}
				else{
					//if don't want to purchase can end session
					console.log("Good Bye! Thanks for coming");
					connection.end();
				}
			})
		}
	});
}

//inventore the item and see if person want to buy more
function inventory(item_update, quantity_update) {
	//UPDATE [table] SET [column] = '[updated-value]' WHERE [column] = [value];
	connection.query(
		"UPDATE products SET ? WHERE ?",
		[
		{
			stock_quantity: quantity_update
		},
		{
			item_id: item_update
		}
		],
		function(error) {
			if (error) throw err;
			inquirer.prompt([{
				name: "anything_else",
				type: "confirm",
				message: "Continue to Purhcase?",
				default: true
			}]).then(function(res){
				if(res.anything_else){
					run();
				}
				else{
					//if nothing else then end session
					console.log("Good Bye! Thanks for coming");
					connection.end();
				}
			})
		})
}

//end Customer js