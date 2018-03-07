# bamazon
Bootcamp Homework 10


### Author:

Jina Li

### What the project does?

This is an Amazon-like storefront application that runs in node, with MySQL as backend database. The app should take in orders from customers and deplete stock from the store's inventory. 

Currently the app is a development in progress. The Customer interface is done, but work still needs to be done to complete Manager and Supervisor components.

### How users can get started with the project?

User needs to be accessing a database called `bamazon_db` created with table `products` that includes list of products
   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)

 `bamazon.sql` and `products.txt` can help with this creation.


Users may then get started by running `bamazonCustomer.js`

### Where users can get help with your project?

Please email me at jinali.berkeley@gmail.com.

Also visit https://www.npmjs.com/ for info on API packages used (mysql and inquirer was used in this project)
