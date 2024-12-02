import { Product, Category } from "./designPatterns/Composite.js";
import {
  StockManager,
  NotificationManager,
} from "./designPatterns/Observer.js";
import { WarehouseLayoutManager } from "./designPatterns/Singleton.js";

// DOM Elements for Layout
const layoutDisplay = document.getElementById("layoutDisplay"); // Display for the layout
const layoutSectionInput = document.getElementById("layoutSection"); // Input for layout section name
const layoutContentInput = document.getElementById("layoutContent"); // Input for layout content
const updateLayoutBtn = document.getElementById("updateLayoutBtn"); // Button to update layout

// DOM Elements where data will be displayed.
const inventoryDisplay = document.getElementById("inventoryDisplay");
const notificationsDisplay = document.getElementById("notificationsDisplay");
const addedItemsDisplay = document.getElementById("addedItemsDisplay");

// Buttons for user interactions.
const addProductBtn = document.getElementById("addProduct");
const addCategoryBtn = document.getElementById("addCategory");
const updateStockBtn = document.getElementById("updateStock");

// An instance of NotificationManager to respond to stock notifications.
const notificationManager = new NotificationManager();

// An instance of StockManager to manage product stock levels.
const stockManager = new StockManager();

// To receive notifications on stock updates.
stockManager.subscribe(notificationManager);

// Create warehouse and categories.
const warehouse = new Category("Warehouse");

// Initializing WarehouseLayoutManager Singleton.
const layoutManager = new WarehouseLayoutManager(); // Singleton instance of WarehouseLayoutManager.
layoutManager.setLayout({
  sectionA: "Electronics",
  sectionB: "Furniture",
  sectionC: "Clothing",
}); // Setting the initial warehouse layout.

// Function to display the current layout.
function displayLayout() {
  layoutDisplay.innerHTML = ""; // Clearing the layout display.
  const ul = document.createElement("ul");
  const layout = layoutManager.getLayout(); // Getting the current layout.
  for (const section in layout) {
    const li = document.createElement("li");
    li.textContent = `${section}: ${layout[section]}`; // Showing section name and its content.
    ul.appendChild(li);
  }
  layoutDisplay.appendChild(ul); // Adding the list to the layout display.
}

// Updating the layout.
updateLayoutBtn.addEventListener("click", () => {
  const section = layoutSectionInput.value; // Getting section name.
  const content = layoutContentInput.value; // Getting section content.
  if (section && content) {
    layoutManager.updateSection(section, content); // Updating the layout.
    displayLayout(); // Refreshing the layout display.
    layoutSectionInput.value = ""; // Clearing inputs.
    layoutContentInput.value = "";
  }
});

// Extending NotificationManager to update notifications dynamically.
notificationManager.update = function (product) {
  const notification = document.createElement("li"); // Creating a new list item.
  notification.textContent = `Notification: ${product} stocks are running low!`; // Setting an alert message.
  notificationsDisplay.appendChild(notification); // Adding the notification to its list.
};

// Function to display inventory recursively.
function displayInventory(category, container) {
  const ul = document.createElement("ul"); // Creating a new list.
  ul.innerHTML = `<strong>${category.getName()}</strong>`; // Displaying the category name.
  category.components.forEach((component) => {
    if (component instanceof Category) {
      // If the component is a category, call displayInventory.
      displayInventory(component, ul);
    } else {
      // else, create a list with item details.
      const li = document.createElement("li");
      li.textContent = `${component.getName()} - $${component.getPrice()}`;
      ul.appendChild(li); // Adding the product to the list.
    }
  });
  container.appendChild(ul); // Adding the list to the parent container.
}

// Function to update the inventory display.
function updateDisplay() {
  inventoryDisplay.innerHTML = ""; // Clearing the current state.

  displayInventory(warehouse, inventoryDisplay); // Rebuilding the display with updated state.
  displayLayout();
}

// Function to update the "Added Items" section.
function updateAddedItems(name, price = null) {
  const listItem = document.createElement("li"); // Creating a new list item.
  if (price !== null) {
    listItem.textContent = `Product: ${name} - $${price}`; // If the item is a product, display its name and price.
  } else {
    listItem.textContent = `Category: ${name}`; // else, display its name.
  }
  addedItemsDisplay.appendChild(listItem); // Adding the item to the related list.
}

// Listener for adding a new product.
addProductBtn.addEventListener("click", () => {
  // Fetching input elements.
  const nameInput = document.getElementById("itemName");
  const priceInput = document.getElementById("itemPrice");

  // Getting the values from the input fields.
  const name = nameInput.value.trim(); // Ensure no extra spaces.
  const price = parseFloat(priceInput.value);

  // Proceed if the input is valid.
  if (name && !isNaN(price)) {
    const product = new Product(name, price); // Creating a new Product instance.
    warehouse.add(product); // Adding the product to the warehouse.
    updateAddedItems(name, price); // Updating the related section.
    updateDisplay(); // Updating the display.
    // Clearing the input fields after adding the product.
    nameInput.value = "";
    priceInput.value = "";
  }
});

// Listener for adding a new category.
addCategoryBtn.addEventListener("click", () => {
  // Fetching the input elements.
  const nameInput = document.getElementById("itemName");
  const priceInput = document.getElementById("itemPrice");

  // Getting the value from the input field.
  const name = nameInput.value.trim(); // Ensure no extra spaces.
  // Proceed if the input is valid.
  if (name) {
    const category = new Category(name);
    warehouse.add(category); // Adding the category to the warehouse.
    updateAddedItems(name); // Updating the related section.
    updateDisplay(); // Updating the display.
    // Clearing the input fields after adding the product.
    nameInput.value = "";
    priceInput.value = "";
  }
});

// Listener for updating the stock of a product.
updateStockBtn.addEventListener("click", () => {
  // Fetching the input elements
  const nameInput = document.getElementById("productName");
  const quantityInput = document.getElementById("productStock");
  // Getting the values.
  const name = nameInput.value.trim(); // Ensure no extra spaces
  const quantity = parseInt(quantityInput.value, 10);
  // Proceed if the input is valid.
  if (name && !isNaN(quantity)) {
    // Updating the stock.
    stockManager.updateStock(name, quantity);

    // Clearing the input fields after successful update.
    nameInput.value = "";
    quantityInput.value = "";
  }
});

// Add initial data to the warehouse for demo.
const technology = new Category("Technology");
const computer = new Product("Computer", 1000);
const phone = new Product("Phone", 700);
// Adding the products to the categories.
technology.add(computer);
technology.add(phone);
warehouse.add(technology);

// Display the inventory.
updateDisplay();
