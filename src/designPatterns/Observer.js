// Observer Pattern

//The StockManager class serves as the subject of the Observer Pattern. It keeps a product list and notifies registered observers when stocks change.
class StockManager {
  constructor() {
    this.products = {};
    this.observers = [];
  }

  // Adds an observer to the observers list.
  subscribe(observer) {
    this.observers.push(observer);
  }

  // Removes an observer from the observers list by filtering out the observer to be removed.
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Notifies all observers of a change in stock for each product by iterating through all observers and calling their update method.
  notify(product) {
    for (const observer of this.observers) {
      observer.update(product);
    }
  }

  // Updates the stock amount for a specific product.
  updateStock(product, amount) {
    this.products[product] = amount;
    console.log(`${product} stock was updated to ${amount}`);

    // Notify observers that the stock is running low, if the amount is below 3 items.
    if (amount < 3) {
      this.notify(product);
    }
  }
}

// The NotificationManager class serves as an observer in the Observer pattern. It monitors stock levels and responds to low stock alerts.
class NotificationManager {
  update(product) {
    console.log(`Notification: ${product} stocks are running low!`);
  }
}

export { StockManager, NotificationManager };
