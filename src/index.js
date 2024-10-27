import { Product, Category } from "./designPatterns/Composite.js";
import {
  StockManager,
  NotificationManager,
} from "./designPatterns/Observer.js";

// An instance of NotificationManager to respond to stock notifications.
const notificationManager = new NotificationManager();

// An instance of StockManager to manage product stock levels.
const stockManager = new StockManager();

// To receive notifications on stock updates.
stockManager.subscribe(notificationManager);

// Creates a category for technology.
const technology = new Category("Technology");

// Creates instances of computer and phone products with their corresponding prices.
const computer = new Product("Computer", 1000);
const phone = new Product("Phone", 700);

// Adds the computer and phone products to the technology category.
technology.add(computer);
technology.add(phone);

// Creates a category for warehouse to organize the technology category.
const warehouse = new Category("Warehouse");

// Adds the technology category to the warehouse category.
warehouse.add(technology);

// Updates the stock.
stockManager.updateStock("Technology", 2); // Should trigger alert for low stock
