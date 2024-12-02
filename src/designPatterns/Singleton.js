// Singleton pattern for managing warehouse layout
class WarehouseLayoutManager {
  constructor() {
    if (WarehouseLayoutManager.instance) {
      // Returning the existing instance if exists.
      return WarehouseLayoutManager.instance;
    }
    this.layout = {}; // Initializing the layout as an empty object.
    WarehouseLayoutManager.instance = this; // Storing the instance.
  }

  setLayout(layout) {
    this.layout = layout; // Setting the warehouse layout.
  }

  getLayout() {
    return this.layout; // Getting the warehouse layout.
  }

  updateSection(section, content) {
    this.layout[section] = content; // Updating the specific section.
  }
}

export { WarehouseLayoutManager };
