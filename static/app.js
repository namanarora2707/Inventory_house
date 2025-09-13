const API_URL = "http://localhost:5000/api/items";

/* ==========================
   INSERT PAGE
========================== */
if (document.body.dataset.page === "insert") {
  document.getElementById("insert-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const brand = document.getElementById("brand").value.trim();
    const type = document.getElementById("type").value.trim();
    const modelNo = document.getElementById("modelNo").value.trim();
    const size = document.getElementById("size").value.trim();
    const mrp = parseFloat(document.getElementById("mrp").value) || 0;
    const color = document.getElementById("color").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value, 10) || 0;

    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, type, modelNo, size, mrp, color, quantity }),
      });

      const data = await res.json();
      document.getElementById("insert-msg").innerText =
        data.message || data.error || "Saved.";
      document.getElementById("insert-form").reset();
    } catch (err) {
      document.getElementById("insert-msg").innerText = "Error adding item.";
      console.error(err);
    }
  });
}

/* ==========================
   REMOVE PAGE
========================== */
if (document.body.dataset.page === "remove") {
  document.getElementById("delete-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const modelNo = document.getElementById("modelNo").value.trim();
    const size = document.getElementById("size").value.trim();
    const mrp = parseFloat(document.getElementById("mrp").value) || 0;
    const color = document.getElementById("color").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value, 10) || 0;

    if (!modelNo || !size || !mrp || !color || isNaN(quantity) || quantity <= 0) {
      alert("Enter valid details!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelNo, size, mrp, color, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        document.getElementById("delete-form").reset();
      } else {
        alert(data.error || "Error removing item!");
      }
    } catch (err) {
      alert("Server error. Try again!");
      console.error(err);
    }
  });
}

/* ==========================
   CHECK / RECORD PAGE
========================== */
if (document.body.dataset.page === "check") {
  const tbody = document.querySelector("#record-table tbody");

  async function loadTable() {
    const res = await fetch(API_URL);
    const items = await res.json();
    tbody.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input value="${item.brand}" data-field="brand" /></td>
        <td><input value="${item.type}" data-field="type" /></td>
        <td><input value="${item.modelNo}" data-field="modelNo" /></td>
        <td><input value="${item.size}" data-field="size" /></td>
        <td><input type="number" value="${item.mrp}" data-field="mrp" /></td>
        <td><input value="${item.color}" data-field="color" /></td>
        <td><input type="number" value="${item.quantity}" data-field="quantity" /></td>
        <td>
          <button class="btn edit-btn" data-id="${item._id}">Save</button>
          <button class="btn delete-btn" data-id="${item._id}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    /* ----- Edit Row ----- */
    tbody.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const row = btn.closest("tr");
        const fields = row.querySelectorAll("input");
        const data = {};
        fields.forEach((f) => {
          data[f.dataset.field] =
            f.dataset.field === "mrp" || f.dataset.field === "quantity"
              ? parseFloat(f.value) || 0
              : f.value.trim();
        });

        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        loadTable();
      })
    );

    /* ----- Delete Row ----- */
    tbody.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to delete this item?")) {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          loadTable();
        }
      })
    );
  }

  /* ✅ Search across all fields */
  const searchEl = document.getElementById("search-box");
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const q = searchEl.value.toLowerCase();
      tbody.querySelectorAll("tr").forEach((tr) => {
        const match = Array.from(tr.querySelectorAll("input")).some((inp) =>
          inp.value.toLowerCase().includes(q)
        );
        tr.style.display = match ? "" : "none";
      });
    });
  }

  loadTable();
}
