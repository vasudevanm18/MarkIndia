let allProducts = [];

// LOAD PRODUCTS
function loadProducts() {
  const container = document.getElementById("products");

  db.ref("products").on("value", snap => {
    allProducts = [];

    snap.forEach(child => {
      allProducts.push({ id: child.key, ...child.val() });
    });

    displayProducts(allProducts);
  });
}

// DISPLAY
function displayProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "No products found";
    return;
  }

  list.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="openProduct('${p.id}')">
        <img src="${p.image}">
        <h3>${p.title}</h3>
        <p>₹${p.price}</p>
        ${p.sold ? "<span class='sold'>SOLD</span>" : ""}
      </div>
    `;
  });
}

// OPEN PRODUCT
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// SEARCH + FILTER
function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const filtered = allProducts.filter(p => {
    return (
      p.title.toLowerCase().includes(query) &&
      (category === "all" || p.category === category)
    );
  });

  displayProducts(filtered);
}
