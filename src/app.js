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
    Notiflix.Notify.success("Layout updated successfully!");
    displayLayout(); // Refreshing the layout display.
    layoutSectionInput.value = ""; // Clearing inputs.
    layoutContentInput.value = "";
  }
});

// Extending NotificationManager to update notifications dynamically.
notificationManager.update = function (productName, quantity) {
  const notification = document.createElement("li");
  notification.textContent = `Stock Update: ${productName}'s stock quantity is now ${quantity}`;
  notificationsDisplay.appendChild(notification);
};

// Function to display inventory in a table format.
function displayInventory(category, container) {
  container.innerHTML = "";

  category.components.forEach((component) => {
    if (component instanceof Category) {
      component.components.forEach((product) => {
        if (product instanceof Product) {
          const row = document.createElement("tr");

          // Category name.
          const categoryNameCell = document.createElement("td");
          categoryNameCell.textContent = component.getName();
          row.appendChild(categoryNameCell);

          // Product name.
          const productNameCell = document.createElement("td");
          productNameCell.textContent = product.getName();
          row.appendChild(productNameCell);

          // Price.
          const priceCell = document.createElement("td");
          priceCell.textContent = `$${product.getPrice()}`;
          row.appendChild(priceCell);

          // Stock quantity.
          const stockQuantityCell = document.createElement("td");
          stockQuantityCell.textContent = product.stockQuantity || 0; // If undefined, display 0.
          row.appendChild(stockQuantityCell);

          // Operations.
          const actionCell = document.createElement("td");
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.className = "btn btn-danger btn-sm";
          removeButton.addEventListener("click", () => {
            component.remove(product);
            Notiflix.Notify.success("Product removed successfully!");
            displayInventory(category, container);
          });
          actionCell.appendChild(removeButton);
          row.appendChild(actionCell);

          container.appendChild(row);
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
  populateProductUpdateDropdowns(); // Yeni eklenen
  displayCategoryTable();
}

// Function to populate category dropdown
function populateCategoryDropdown() {
  const productCategorySelect = document.getElementById("productCategory");
  productCategorySelect.innerHTML = "<option value=''>Select Category</option>";

  warehouse.components.forEach((component) => {
    if (component instanceof Category) {
      const option = document.createElement("option");
      option.value = component.getName();
      option.textContent = component.getName();
      productCategorySelect.appendChild(option);
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
  const nameInput = document.getElementById("itemName");
  const priceInput = document.getElementById("itemPrice");
  const quantityInput = document.getElementById("itemQuantity");
  const selectedCategoryName = document.getElementById("productCategory").value;

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const quantity = parseInt(quantityInput.value, 10);

  if (name && !isNaN(price) && !isNaN(quantity) && selectedCategoryName) {
    // We are updating the way to create a new Product.
    const product = new Product(name, price, quantity);

    // Finding category.
    const selectedCategory = warehouse.components.find(
      (component) =>
        component instanceof Category &&
        component.getName() === selectedCategoryName
    );

    if (selectedCategory) {
      selectedCategory.add(product);

      // Updating UI.
      updateDisplay();

      // Input alanlarını temizle
      nameInput.value = "";
      priceInput.value = "";
      quantityInput.value = "";

      Notiflix.Notify.success("Product added successfully!");
    }
  } else {
    Notiflix.Notify.failure("Please fill in all fields correctly!");
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
    Notiflix.Notify.success("Category added successfully!");
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
          component instanceof Category &&
          component.getName() === selectedCategoryName
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
  const categorySelect = document.getElementById("updateCategory");
  const productSelect = document.getElementById("updateProduct");
  const quantityInput = document.getElementById("productStock");

  const selectedCategoryName = categorySelect.value.trim();
  const selectedProductName = productSelect.value.trim();
  const quantity = parseInt(quantityInput.value, 10);

  if (selectedCategoryName && selectedProductName && !isNaN(quantity)) {
    const selectedCategory = warehouse.components.find(
      (component) =>
        component instanceof Category &&
        component.getName() === selectedCategoryName
    );

    if (selectedCategory) {
      const selectedProduct = selectedCategory.components.find(
        (component) =>
          component instanceof Product &&
          component.getName() === selectedProductName
      );

      if (selectedProduct) {
        // Updating stock quantity.
        selectedProduct.updateStock(quantity);

        // Triggering notification using StockManager.
        stockManager.updateStock(selectedProduct.getName(), quantity);

        // Updating UI.
        updateDisplay();

        // Clearing input fields.
        categorySelect.value = "";
        productSelect.innerHTML = "<option value=''>Select a Product</option>";
        quantityInput.value = "";

        Notiflix.Notify.success(
          `${selectedProduct.getName()}'s stock updated successfully!`
        );
      }
    }
  } else {
    Notiflix.Notify.failure("Please fill in all fields correctly!");
  }
});

// Add initial data to the warehouse for demo.
const technology = new Category("Technology");
const computer = new Product("Computer", 1000, 5);
const phone = new Product("Phone", 700, 10);
technology.add(computer);
technology.add(phone);
warehouse.add(technology);

// Product güncelleme için dropdown populate fonksiyonu
function populateProductUpdateDropdowns() {
  const categorySelect = document.getElementById("updateProductCategory");
  const productSelect = document.getElementById("updateProductName");

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
    productSelect.innerHTML = "<option value=''>Select a Product</option>";

    if (selectedCategoryName) {
      const selectedCategory = warehouse.components.find(
        (component) =>
          component instanceof Category &&
          component.getName() === selectedCategoryName
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

// Event listener for Update Product button.
document.getElementById("updateProductBtn").addEventListener("click", () => {
  const categorySelect = document.getElementById("updateProductCategory");
  const productSelect = document.getElementById("updateProductName");
  const priceInput = document.getElementById("updateProductPrice");

  const selectedCategoryName = categorySelect.value.trim();
  const selectedProductName = productSelect.value.trim();
  const newPrice = parseFloat(priceInput.value);

  if (selectedCategoryName && selectedProductName && !isNaN(newPrice)) {
    const selectedCategory = warehouse.components.find(
      (component) =>
        component instanceof Category &&
        component.getName() === selectedCategoryName
    );

    if (selectedCategory) {
      const selectedProduct = selectedCategory.components.find(
        (component) =>
          component instanceof Product &&
          component.getName() === selectedProductName
      );

      if (selectedProduct) {
        // Updating product price.
        selectedProduct.price = newPrice;

        // Creating notification/
        const notification = document.createElement("li");
        notification.textContent = `Product Update: ${selectedProduct.getName()}'s price updated to $${newPrice}`;
        notificationsDisplay.appendChild(notification);

        // Updating UI.
        updateDisplay();

        // Clearing input fields/
        categorySelect.value = "";
        productSelect.innerHTML = "<option value=''>Select a Product</option>";
        priceInput.value = "";

        Notiflix.Notify.success(
          `${selectedProduct.getName()}'s price updated successfully!`
        );
      }
    }
  } else {
    Notiflix.Notify.failure("Please fill in all fields correctly!");
  }
});

// Display the inventory.
updateDisplay();
