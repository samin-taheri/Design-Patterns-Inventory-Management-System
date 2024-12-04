// Observer Pattern

//The StockManager class serves as the subject of the Observer Pattern. It keeps a product list and notifies registered observers when stocks change.
class StockManager {
  constructor() {
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
  updateStock(productName, quantity) {
    // Stok güncellendiğinde observers'ları bilgilendir
    this.notifyObservers(productName, quantity);
  }

  notifyObservers(productName, quantity) {
    this.observers.forEach(observer => {
      observer.update(productName, quantity);
    });
  }
}

// The NotificationManager class serves as an observer in the Observer pattern. It monitors stock levels and responds to low stock alerts.
class NotificationManager {
  update(productName, quantity) {
    // Bu metod app.js'de override edilecek
  }
}

export { StockManager, NotificationManager };
