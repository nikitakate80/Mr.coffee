document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    const cartCount = document.querySelector(".nav-cart span");
    const cartIcon = document.querySelector(".nav-cart");
    const addToCartButtons = document.querySelectorAll(".product-card-btn");

    const cartContainer = document.createElement("div");
    cartContainer.classList.add("cart-container");
    cartContainer.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="close-cart">&times;</button>
        </div>
        <ul class="cart-items"></ul>
        <p class="cart-empty" style="display: none; text-align: center; color: #888;">Your cart is empty.</p>
        <p class="cart-total">Total: $0</p>
        <button class="buy-now" style="display: none;">Buy Now</button>
    `;
    document.body.appendChild(cartContainer);

    const cartItemsList = cartContainer.querySelector(".cart-items");
    const cartEmptyMessage = cartContainer.querySelector(".cart-empty");
    const buyNowBtn = cartContainer.querySelector(".buy-now");
    const cartTotal = cartContainer.querySelector(".cart-total");
    const closeCartBtn = cartContainer.querySelector(".close-cart");

    function showPopup(message) {
        const popup = document.createElement("div");
        popup.classList.add("cart-popup");
        popup.textContent = message;
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 500);
        }, 1500);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const productBox = button.closest(".product-box");
            const productName = productBox.querySelector(".product-text-title").innerText;
            const priceElement = productBox.querySelector(".product-box-text span");
            
            if (!priceElement) return;
            const productPrice = parseFloat(priceElement.childNodes[0].nodeValue.replace("$", "").trim());
            if (isNaN(productPrice)) return;

            let existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            updateCart();
            showPopup(`${productName} added to cart!`);
        });
    });

    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartEmptyMessage.style.display = "block";
            buyNowBtn.style.display = "none";
        } else {
            cartEmptyMessage.style.display = "none";
            buyNowBtn.style.display = "block";
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - $${item.price.toFixed(2)}
                <button class="decrease" data-index="${index}">-</button>
                ${item.quantity}
                <button class="increase" data-index="${index}">+</button>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartCount.textContent = cart.length;
        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        document.querySelectorAll(".increase, .decrease").forEach(button => {
            button.style.borderRadius = "50%";
            button.style.width = "20px";
            button.style.height = "20px";
            button.style.border = "1px solid #9c8461";
            button.style.background = "transparent";
            button.style.color = "#9c8461";
            button.style.fontSize = "14px";
            button.style.cursor = "pointer";
            button.style.display = "inline-flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.margin = "0 5px";
        });

        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                cart[index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    cartIcon.addEventListener("click", () => {
        cartContainer.style.display = cartContainer.style.display === "block" ? "none" : "block";
    });

    closeCartBtn.addEventListener("click", () => {
        cartContainer.style.display = "none";
    });

    const style = document.createElement("style");
    style.innerHTML = `
        .cart-popup {
            position: fixed;
            top: 10px;
            right: 20px;
            background: #9c8461;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 16px;
            opacity: 1;
            transition: opacity 0.5s;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
});
