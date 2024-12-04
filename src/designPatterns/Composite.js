// Composite Pattern

// Abstract class: Represents a generic "component" in a composite structure.
class Component {
  getName() {
    // Throws an error to ensure that subclasses provide their own implementations.
    throw new Error("This method must be overridden by subclasses!");
  }

  // Allows subclasses to create their own pricing mechanism.
  getPrice() {
    throw new Error("This method must be overridden by subclasses!");
  }

  // Adds a component that is not relevant to leaf nodes; subclasses must override it.
  add(component) {
    throw new Error("This method must be overridden by subclasses!");
  }

  // Removes a component that is no longer required by leaf nodes; subclasses must override it.
  remove(component) {
    throw new Error("This method must be overridden by subclasses!");
  }

  // Retrieves a child component by index; subclasses must override it.
  getChild(index) {
    throw new Error("This method must be overridden by subclasses!");
  }
}

// Concrete class Component: Represents a leaf node in the composite structure.
class Product extends Component {
  constructor(name, price) {
    super();
    this.name = name;
    this.price = price;
    this.stockQuantitys = [];
  }

  // Overrides the getName() to return the name of the product.
  getName() {
    return this.name;
  }

  //Add stock quantity 
  addStockQuantity(quantity){
    this.stockQuantitys.push(quantity);
  }

  // Overrides the getPrice() to return the price of the product.
  getPrice() {
    return this.price;
  }
}

// Concrete class Category: Defines a composite object in the composite structure. Can contain both products and subcategories.
class Category extends Component {
  constructor(name) {
    super();
    this.name = name;
    this.components = [];
  }

  getName() {
    return this.name;
  }

  add(component) {
    this.components.push(component);
  }

  remove(component) {
    this.components = this.components.filter((item) => item !== component);
  }

  getChild(index) {
    return this.components[index];
  }

  // Calculates the total price.
  getPrice() {
    return this.components.reduce(
      // Iterates through each child component, calling getPrice() to sum up all the prices.
      (sum, component) => sum + component.getPrice(),
      0 // Initial value is 0.
    );
  }
}

export { Component, Product, Category };
