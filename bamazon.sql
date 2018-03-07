-- this drop and create database doesn't have to be run everytime
-- can comment out
-- I use command line, so just won't copy and paste these lines each time
DROP DATABASE bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- create table also doesn't have to be run evertime
-- will error out if run more than once since there is no drop table
CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2),
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

-- instead of writing insert statements, I inputted data into csv and loaded the file
load data local infile 
'C:/Users/jli1/class/classActivities/12-mysql/02-Homework/bamazon/products.txt' 
into table products
FIELDS TERMINATED BY ','
lines terminated by '\n';
--IGNORE 1 LINES

-- checking my table
select * from products;