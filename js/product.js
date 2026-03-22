let allProducts = [];
let currentProductId = null;

// =========================
// LOAD ALL PRODUCTS
// =========================
function loadProducts() {
  console.log("🔥 loadProducts called");

  const container = document.getElementById("products");

  if (!db) {
    console.log("❌ DB is null");
    container.innerHTML = "Database not connected";
    return;
  }

  db.ref("products").on("value", snap => {
    console.log("📦 DATA:", snap.val());

    allProducts = [];

    if (!snap.exists()) {
      container.innerHTML = "No products found";
      return;
    }

    snap.forEach(child => {
      allProducts.push({ id: child.key, ...child.val() });
    });

    displayProducts(allProducts);
  });
}

// =========================
// DISPLAY PRODUCTS
// =========================
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

// =========================
// OPEN PRODUCT PAGE
// =========================
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// =========================
// SEARCH + FILTER
// =========================
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

// =========================
// LOAD SINGLE PRODUCT
// =========================
function loadSingleProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  currentProductId = id;

  db.ref("products/" + id).once("value", snap => {
    const p = snap.val();

    document.getElementById("title").innerText = p.title;
    document.getElementById("price").innerText = "₹" + p.price;
    document.getElementById("category").innerText = p.category;
    document.getElementById("image").src = p.image;

    // Chat button
    document.getElementById("chatBtn").onclick = () => {
      window.location.href = `chat.html?user=${p.userId}`;
    };

    loadReviews(id);
    trackView(id);
  });
}

// =========================
// POST / UPDATE PRODUCT
// =========================
function postAd() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const file = document.getElementById("image").files[0];

  const user = auth.currentUser;

  if (!title || !price) {
    alert("Fill all fields");
    return;
  }

  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  // EDIT MODE
  if (window.editingId) {
    if (file) {
      uploadImage(file).then(imageUrl => {
        db.ref("products/" + window.editingId).update({
          title,
          price,
          category,
          image: imageUrl
        });
      });
    } else {
      db.ref("products/" + window.editingId).update({
        title,
        price,
        category
      });
    }

    alert("Ad updated");
    window.location.href = "profile.html";
    return;
  }

  // CREATE MODE
  if (!file) {
    alert("Please select an image");
    return;
  }

  uploadImage(file).then(imageUrl => {
    const id = Date.now();

    db.ref("products/" + id).set({
      title,
      price,
      category,
      image: imageUrl,
      userId: user.uid,
      sold: false,
      lat,
      lng,
      time: Date.now(),
      views: 0
    });

    alert("Ad posted");
    window.location.href = "index.html";
  });
}

// =========================
// LOAD EDIT DATA
// =========================
function loadEditData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("edit");

  if (!id) return;

  document.getElementById("formTitle").innerText = "Edit Ad";

  db.ref("products/" + id).once("value", snap => {
    const p = snap.val();

    document.getElementById("title").value = p.title;
    document.getElementById("price").value = p.price;
    document.getElementById("category").value = p.category;

    window.editingId = id;
  });
}

// =========================
// DELETE PRODUCT
// =========================
function deleteProduct(id) {
  db.ref("products/" + id).remove();
  alert("Deleted");
}

// =========================
// EDIT REDIRECT
// =========================
function editProduct(id) {
  window.location.href = `post.html?edit=${id}`;
}

// =========================
// MARK AS SOLD
// =========================
function markSold(id) {
  db.ref("products/" + id).update({
    sold: true
  });
}

// =========================
// LOAD MY ADS
// =========================
function loadMyAds() {
  const container = document.getElementById("myAds");
  const user = auth.currentUser;

  db.ref("products").on("value", snapshot => {
    container.innerHTML = "";

    let found = false;

    snapshot.forEach(child => {
      const p = child.val();

      if (p.userId === user.uid) {
        found = true;

        container.innerHTML += `
          <div class="card">
            <img src="${p.image}">
            <h3>${p.title}</h3>
            <p>₹${p.price}</p>

            ${p.sold ? "<span class='sold'>SOLD</span>" : ""}

            <button onclick="editProduct('${child.key}')">Edit</button>
            <button onclick="deleteProduct('${child.key}')">Delete</button>
            ${
              !p.sold
                ? `<button onclick="markSold('${child.key}')">Mark as Sold</button>`
                : ""
            }
          </div>
        `;
      }
    });

    if (!found) {
      container.innerHTML = "No ads posted yet";
    }
  });
}

// =========================
// REVIEWS
// =========================
function loadReviews(productId) {
  const container = document.getElementById("reviews");

  db.ref("reviews/" + productId).on("value", snap => {
    container.innerHTML = "";

    snap.forEach(child => {
      const r = child.val();

      container.innerHTML += `
        <div style="border-bottom:1px solid #ccc; margin:5px 0;">
          ⭐ ${r.rating}<br>
          ${r.text}
        </div>
      `;
    });
  });
}

// =========================
// TRACK VIEWS
// =========================
function trackView(productId) {
  db.ref("products/" + productId + "/views")
    .transaction(v => (v || 0) + 1);
}
