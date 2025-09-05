// Utility: Get/Save Inventory in localStorage
function getInventory() {
  return JSON.parse(localStorage.getItem("inventory")) || [];
}
function saveInventory(data) {
  localStorage.setItem("inventory", JSON.stringify(data));
  checkNotifications();
}

// Insert Data
document.getElementById("insertForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let brand = document.getElementById("brand").value;
  let type = document.getElementById("type").value;
  let model = document.getElementById("model").value;
  let size = document.getElementById("size").value;
  let quantity = parseInt(document.getElementById("quantity").value);

  let inventory = getInventory();
  let item = inventory.find(i => i.model === model);

  if (item) {
    item.quantity += quantity;
  } else {
    inventory.push({ brand, type, model, size, quantity });
  }

  saveInventory(inventory);
  alert("Item added/updated successfully!");
  this.reset();
});

// Remove Data
document.getElementById("removeForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let model = document.getElementById("removeModel").value;
  let quantity = parseInt(document.getElementById("removeQuantity").value);

  let inventory = getInventory();
  let item = inventory.find(i => i.model === model);

  if (!item) {
    alert("Model not found!");
    return;
  }

  if (item.quantity < quantity) {
    alert("Error: Quantity cannot go below zero!");
    return;
  }

  item.quantity -= quantity;
  saveInventory(inventory);
  alert("Item removed successfully!");
  this.reset();
});

// Load Table
function loadTable() {
  let tableBody = document.querySelector("#inventoryTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  let inventory = getInventory();

  inventory.forEach((item, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.brand}</td>
      <td>${item.type}</td>
      <td>${item.model}</td>
      <td>${item.size}</td>
      <td>${item.quantity}</td>
      <td>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
window.onload = loadTable;

// Search Functionality
document.getElementById("searchBox")?.addEventListener("input", function () {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll("#inventoryTable tbody tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

// Edit Item
function editItem(index) {
  let inventory = getInventory();
  let item = inventory[index];
  let newBrand = prompt("Enter new Brand", item.brand);
  let newType = prompt("Enter new Type", item.type);
  let newModel = prompt("Enter new Model", item.model);
  let newSize = prompt("Enter new Size", item.size);
  let newQuantity = parseInt(prompt("Enter new Quantity", item.quantity));

  if (!newBrand || !newType || !newModel || !newSize || isNaN(newQuantity)) return;

  inventory[index] = { brand: newBrand, type: newType, model: newModel, size: newSize, quantity: newQuantity };
  saveInventory(inventory);
  loadTable();
}

// Delete Item
function deleteItem(index) {
  let inventory = getInventory();
  inventory.splice(index, 1);
  saveInventory(inventory);
  loadTable();
}

// Notification check
function checkNotifications() {
  let inventory = getInventory();
  let lowStock = inventory.filter(i => i.quantity < 5);
  let bell = document.getElementById("notification-bell");

  if (lowStock.length > 0) {
    bell.title = lowStock.map(i => `${i.brand}, ${i.type}, ${i.model}, ${i.size} has low stock`).join("\n");
    bell.style.color = "yellow";
  } else {
    bell.title = "All good!";
    bell.style.color = "white";
  }
}
checkNotifications();
