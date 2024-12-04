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

// Buttons for user interactions.
const addProductBtn = document.getElementById("addProduct");
const addCategoryBtn = document.getElementById("addCategory");
const updateStockBtn = document.getElementById("updateStock");

// Additional DOM for new functionality
const productCategorySelect = document.getElementById("productCategory"); // Dropdown for category selection
const categoryNameInput = document.getElementById("categoryName"); // Input for adding new category

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
    // Display success notification
    Notiflix.Notify.success('Layout updated successfully!');
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

// Function to display inventory in a table format
function displayInventory(category, container) {
  container.innerHTML = ""; // Clear the existing content in the table body

  category.components.forEach((component) => {
    if (component instanceof Category) {
      // Loop through the products in the category
      component.components.forEach((product) => {
        if (product instanceof Product) {
          const row = document.createElement("tr"); // Create a new table row

          // Category Name cell
          const categoryNameCell = document.createElement("td");
          categoryNameCell.textContent = component.getName();
          row.appendChild(categoryNameCell);

          // Product Name cell
          const productNameCell = document.createElement("td");
          productNameCell.textContent = product.getName();
          row.appendChild(productNameCell);

          // Price cell
          const priceCell = document.createElement("td");
          priceCell.textContent = `$${product.getPrice()}`;
          row.appendChild(priceCell);

          // Stock Quantity cell
          const stockQuantityCell = document.createElement("td");
          const totalStock = product.stockQuantitys.reduce((a, b) => a + b, 0); // Sum up stock quantities
          stockQuantityCell.textContent = totalStock;
          row.appendChild(stockQuantityCell);

          // Actions cell with Remove button
          const actionCell = document.createElement("td");
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.className = "btn btn-danger btn-sm";
          removeButton.addEventListener("click", () => {
            component.remove(product); // Remove product from the category
            // Display success notification
            Notiflix.Notify.success('Product removed successfully!');
            displayInventory(category, container); // Refresh the table
          });
          actionCell.appendChild(removeButton);
          row.appendChild(actionCell);

          container.appendChild(row); // Append the row to the table body
        }
      });
    }
  });
}

// Function to update the inventory display.
function updateDisplay() {
  inventoryDisplay.innerHTML = ""; // Clearing the current state.

  displayInventory(warehouse, inventoryDisplay); // Rebuilding the display with updated state.
  displayLayout();
  populateCategoryDropdown(); // Update category dropdown
  populateCategoryAndProductDropdowns(); // Update stock category and product dropdown
  displayCategoryTable();
}

// Function to populate category dropdown
function populateCategoryDropdown() {
  productCategorySelect.innerHTML = ""; // Clear existing options
  warehouse.components.forEach((component) => {
    if (component instanceof Category) {
      const option = document.createElement("option");
      option.value = component.getName();
      option.textContent = component.getName();
      productCategorySelect.appendChild(option); // Add category to dropdown
    }
  });
}

// Function to display the categories table
function displayCategoryTable() {
  const addedItemsDisplay = document.getElementById("categoryDisplay"); // Get table body
  addedItemsDisplay.innerHTML = ""; // Clear the table

  // Iterate through warehouse components
  warehouse.components.forEach((component) => {
    if (component instanceof Category) {
      const row = document.createElement("tr"); // Create a new table row

      // Category Name cell
      const categoryNameCell = document.createElement("td");
      categoryNameCell.textContent = component.getName();
      row.appendChild(categoryNameCell);

      // Total Price cell
      const totalPriceCell = document.createElement("td");
      totalPriceCell.textContent = `$${component.getPrice()}`; // Use getPrice() to calculate total price
      row.appendChild(totalPriceCell);

      // Action cell with Remove button
      const actionCell = document.createElement("td");
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "btn btn-danger btn-sm";
      removeButton.addEventListener("click", () => {
        warehouse.remove(component); // Remove category from warehouse
        updateDisplay(); // Update inventory and other related displays
      });
      actionCell.appendChild(removeButton);
      row.appendChild(actionCell);

      // Append the row to the table body
      addedItemsDisplay.appendChild(row);
    }
  });
}

// Listener for adding a new product.
addProductBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("itemName"); // Get product name input
  const priceInput = document.getElementById("itemPrice"); // Get product price input
  const quantityInput = document.getElementById("itemQuantity"); // Get product quantity input
  const selectedCategoryName = productCategorySelect.value; // Get selected category from dropdown

  const name = nameInput.value.trim(); // Get product name
  const price = parseFloat(priceInput.value); // Parse price as float
  const quantity = parseInt(quantityInput.value, 10); // Parse quantity as integer

  // Ensure all inputs are valid
  if (name && !isNaN(price) && !isNaN(quantity) && selectedCategoryName) {
    // Create a new product
    const product = new Product(name, price);
    product.addStockQuantity(quantity); // Add the stock quantity to the product

    // Find the selected category
    const selectedCategory = warehouse.components.find(
      (component) =>
        component instanceof Category && component.getName() === selectedCategoryName
    );

    if (selectedCategory) {
      selectedCategory.add(product); // Add product to the category
    }

    // Update UI
    updateDisplay(); // Refresh display

    // Clear inputs
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";

    // Display success notification
    Notiflix.Notify.success('Product added successfully!');
  } else {
    // Display error notification if inputs are invalid
    Notiflix.Notify.failure('Please fill all fields correctly!');
  }
});

// Listener for adding a new category.
addCategoryBtn.addEventListener("click", () => {
  const name = categoryNameInput.value.trim();
  if (name) {
    const category = new Category(name);
    warehouse.add(category);
    updateDisplay();
    categoryNameInput.value = "";
    // Display success notification
    Notiflix.Notify.success('Category added successfully!');
  }
});

// Function to populate both category and product dropdowns
function populateCategoryAndProductDropdowns() {
  const categorySelect = document.getElementById("updateCategory"); // Get category dropdown
  const productSelect = document.getElementById("updateProduct"); // Get product dropdown

  // Clear existing options
  categorySelect.innerHTML = "<option value=''>Select a Category</option>";
  productSelect.innerHTML = "<option value=''>Select a Product</option>";

  // Populate categories
  warehouse.components.forEach((component) => {
    if (component instanceof Category) {
      const categoryOption = document.createElement("option");
      categoryOption.value = component.getName();
      categoryOption.textContent = component.getName();
      categorySelect.appendChild(categoryOption);
    }
  });

  // Add event listener to populate products when a category is selected
  categorySelect.addEventListener("change", () => {
    const selectedCategoryName = categorySelect.value;
    productSelect.innerHTML = "<option value=''>Select a Product</option>"; // Reset product dropdown

    if (selectedCategoryName) {
      const selectedCategory = warehouse.components.find(
        (component) =>
          component instanceof Category && component.getName() === selectedCategoryName
      );

      if (selectedCategory) {
        selectedCategory.components.forEach((component) => {
          if (component instanceof Product) {
            const productOption = document.createElement("option");
            productOption.value = component.getName();
            productOption.textContent = component.getName();
            productSelect.appendChild(productOption);
          }
        });
      }
    }
  });
}

// Listener for updating the stock of a product.
updateStockBtn.addEventListener("click", () => {
  const categorySelect = document.getElementById("updateCategory"); // Get category dropdown
  const productSelect = document.getElementById("updateProduct"); // Get product dropdown
  const quantityInput = document.getElementById("productStock"); // Get stock quantity input

  const selectedCategoryName = categorySelect.value.trim(); // Get selected category name
  const selectedProductName = productSelect.value.trim(); // Get selected product name
  const quantity = parseInt(quantityInput.value, 10); // Get quantity as integer

  if (selectedCategoryName && selectedProductName && !isNaN(quantity)) {
    // Find the selected category
    const selectedCategory = warehouse.components.find(
      (component) =>
        component instanceof Category && component.getName() === selectedCategoryName
    );

    if (selectedCategory) {
      // Find the selected product in the category
      const selectedProduct = selectedCategory.components.find(
        (component) =>
          component instanceof Product && component.getName() === selectedProductName
      );

      if (selectedProduct) {
        // Update stock using StockManager
        stockManager.updateStock(selectedProduct.getName(), quantity);
        // Clear inputs after updating
        categorySelect.value = "";
        productSelect.innerHTML = "<option value=''>Select a Product</option>";
        quantityInput.value = "";

        // Optional: Show confirmation or feedback
        notificationsDisplay.innerHTML += `<li>Updated stock for ${selectedProduct.getName()}: ${quantity}</li>`;
        // Display success notification
        Notiflix.Notify.success(`${selectedProduct.getName()}'s stock updated successfully!`);
      }
    }
  }
});

// Add initial data to the warehouse for demo.
const technology = new Category("Technology");
const computer = new Product("Computer", 1000);
const phone = new Product("Phone", 700);
technology.add(computer);
technology.add(phone);
warehouse.add(technology);
computer.addStockQuantity(5);
phone.addStockQuantity(10);

// Display the inventory.
updateDisplay();
