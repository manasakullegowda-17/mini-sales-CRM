console.log("CRM Loaded");

// ===== ADD CUSTOMER =====
const form = document.getElementById("customerForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const salesStage = document.getElementById("sales_stage").value;

    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    customers.push({ name, email, phone, salesStage });

    localStorage.setItem("customers", JSON.stringify(customers));

    alert("Customer Added!");
    form.reset();
  });
}

// ===== DISPLAY CUSTOMERS =====
const table = document.getElementById("customerTable");

if (table) {

  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  function render(data) {
    table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Stage</th>
        <th>Actions</th>
      </tr>
    `;

    data.forEach((cust, index) => {
      const row = table.insertRow();

      row.insertCell(0).textContent = cust.name;
      row.insertCell(1).textContent = cust.email;
      row.insertCell(2).textContent = cust.phone;
      row.insertCell(3).textContent = cust.salesStage;

      const actionCell = row.insertCell(4);

      // Delete
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => {
        customers.splice(index, 1);
        localStorage.setItem("customers", JSON.stringify(customers));
        render(customers);
      };

      // Edit
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        const newName = prompt("Edit Name:", cust.name);
        if (newName) {
          cust.name = newName;
          localStorage.setItem("customers", JSON.stringify(customers));
          render(customers);
        }
      };

      actionCell.appendChild(editBtn);
      actionCell.appendChild(delBtn);
    });
  }

  render(customers);

  // Search
  document.getElementById("search").addEventListener("input", function() {
    const value = this.value.toLowerCase();
    const filtered = customers.filter(c => c.name.toLowerCase().includes(value));
    render(filtered);
  });

  // Filter
  document.getElementById("filterStage").addEventListener("change", function() {
    const stage = this.value;
    if (stage === "All") {
      render(customers);
    } else {
      const filtered = customers.filter(c => c.salesStage === stage);
      render(filtered);
    }
  });
}

// ===== SALES OVERVIEW =====
const totalEl = document.getElementById("totalCustomers");

if (totalEl) {
  const customers = JSON.parse(localStorage.getItem("customers")) || [];

  document.getElementById("totalCustomers").textContent = customers.length;

  let newCount = 0, inProgress = 0, closed = 0;

  customers.forEach(c => {
    if (c.salesStage === "New") newCount++;
    else if (c.salesStage === "In Progress") inProgress++;
    else if (c.salesStage === "Closed") closed++;
  });

  document.getElementById("newCount").textContent = newCount;
  document.getElementById("inProgressCount").textContent = inProgress;
  document.getElementById("closedCount").textContent = closed;
}