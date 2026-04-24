const product = JSON.parse(localStorage.getItem("product"));

if (!product) {
  alert("No product found");
}

// SET DATA
document.getElementById("p-img").src = product.image;
document.getElementById("p-name").innerText = product.name;
document.getElementById("p-price").innerText = "₹" + product.price;
document.getElementById("p-rating").innerText = product.rating;
document.getElementById("p-reviews").innerText = product.reviews;
document.getElementById("p-desc").innerText = product.description;

// FEATURES
const list = document.getElementById("p-features");

product.features.forEach(f => {
  const li = document.createElement("li");
  li.innerText = f;
  list.appendChild(li);
});

// CART
function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}