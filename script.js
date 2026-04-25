let products = [
  {name:"iPhone 14", price:70000, img:"iphone.jpg", gst:0.18, category:"electronics"},
  {name:"Shoes", price:2000, img:"shoes.jpg", gst:0.12, category:"fashion"},
  {name:"Toothpaste", price:150, img:"toothpaste.jpg", gst:0.05, category:"daily"},
  {name:"Keychain", price:100, img:"keychain.jpg", gst:0.12, category:"accessories"},
  {name:"Pen", price:20, img:"pen.jpg", gst:0.05, category:"accessories"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let couponDiscount = 0;

/* ================= LOAD PRODUCTS ================= */

window.onload = function(){
  if(document.getElementById("productList")){
    displayProducts(products);
  }

  if(document.getElementById("cartItems")){
    renderCart();
  }

  if(document.getElementById("p-name")){
    let p = JSON.parse(localStorage.getItem("product"));
    document.getElementById("p-img").src = p.img;
    document.getElementById("p-name").innerText = p.name;
    document.getElementById("p-price").innerText = "₹"+p.price;
  }
};

/* ================= DISPLAY PRODUCTS ================= */

function displayProducts(list){
  let container = document.getElementById("productList");
  container.innerHTML = "";

  list.forEach((p,index)=>{
    container.innerHTML += `
      <div class="card" onclick="openProduct(${index})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    `;
  });
}

/* ================= FILTER ================= */

function filterCategory(cat){
  let filtered = products.filter(p => p.category === cat);
  displayProducts(filtered);
}

function searchProducts(){
  let val = document.getElementById("search").value.toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(val));
  displayProducts(filtered);
}

/* ================= PRODUCT PAGE ================= */

function openProduct(index){
  localStorage.setItem("product", JSON.stringify(products[index]));
  window.location.href = "product.html";
}

/* ================= CART ================= */

function addToCart(){
  let p = JSON.parse(localStorage.getItem("product"));
  let existing = cart.find(i=>i.name===p.name);

  if(existing) existing.qty++;
  else cart.push({...p, qty:1});

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

function goToCart(){
  window.location.href = "cart.html";
}

/* ================= RENDER CART ================= */

function renderCart(){
  let container = document.getElementById("cartItems");
  container.innerHTML="";

  let subtotal=0, gst=0;

  cart.forEach((item,i)=>{
    let itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    gst += itemTotal * item.gst;

    container.innerHTML+=`
      <div class="cart-item">
        <img src="${item.img}" class="cart-img">

        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>

          <div class="qty-box">
            <button onclick="decreaseQty(${i})">-</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${i})">+</button>
          </div>

          <button onclick="removeItem(${i})">Remove</button>
        </div>
      </div>
    `;
  });

  let discount = subtotal > 5000 ? subtotal * 0.1 : 0;
  let delivery = subtotal > 1000 ? 0 : 50;

  let total = subtotal + gst - discount - couponDiscount + delivery;

  document.getElementById("subtotal").innerText="₹"+subtotal;
  document.getElementById("gst").innerText="₹"+gst.toFixed(2);
  document.getElementById("discount").innerText="₹"+(discount + couponDiscount).toFixed(2);
  document.getElementById("delivery").innerText="₹"+delivery;
  document.getElementById("total").innerText="₹"+total.toFixed(2);
}

/* ================= QUANTITY ================= */

function increaseQty(i){
  cart[i].qty++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQty(i){
  if(cart[i].qty > 1){
    cart[i].qty--;
  } else {
    cart.splice(i,1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ================= COUPON ================= */

function applyCoupon(){
  let code = document.getElementById("coupon").value;

  if(code === "SAVE10"){
    couponDiscount = 100;
    alert("Coupon applied! ₹100 OFF 🎉");
  } else {
    couponDiscount = 0;
    alert("Invalid coupon ❌");
  }

  renderCart();
}

/* ================= PAYMENT ================= */

function checkout(){
  window.location.href="payment.html";
}

/* ================= FINAL PAYMENT ================= */

function finishPayment(){
  localStorage.removeItem("cart");
  window.location.href = "success.html";
}
