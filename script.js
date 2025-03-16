// item btns
const allAddBtns = document.querySelectorAll("#add-to-cart");
const allItemQuantities = document.getElementById("#item-quantity");
// cart
const emptyCart = document.querySelector("#empty-cart");
const cart = document.querySelector("#cart");
const cartBtn = document.querySelector("#confirm");

const modal = document.querySelector("#modal");

let cartItemQuantity = 0;

// zmiana przycisku
const changeBtn = (btn) => {
   const originalHTML = btn.outerHTML;
   const newBtn = document.createElement("button");
   newBtn.classList.add(
      "flex",
      "justify-center",
      "items-center",
      "absolute",
      "bg-amber-600",
      "left-1/2",
      "-translate-x-1/2",
      "bottom-[25%]",
      "rounded-3xl",
      "px-8",
      "py-3",
      "font-semibold",
      "whitespace-nowrap",
      "border-1",
      "border-gray-800",
      "lg:bottom-[35%]",
      "xl:bottom-[28%]",
      "cursor-pointer",
      "text-white",
      "space-x-8",
      "min-w-[162px]"
   );

   newBtn.innerHTML = `
        <img src="./img/icon-decrement-quantity.svg" class="rounded-[50%] border-1 border-white w-[20px] h-[20px] p-1 minus">
        <span class="item-quantity">1</span>
        <img src="./img/icon-increment-quantity.svg" class="rounded-[50%] border-1 border-white w-[20px] h-[20px] p-1 plus">
    `;

   newBtn.dataset.original = originalHTML;
   btn.replaceWith(newBtn);

   newBtn.querySelector(".plus").addEventListener("click", increaseQuantity);
   newBtn.querySelector(".minus").addEventListener("click", decreaseQuantity);

   cartItemQuantity += 1;
   handleCarts(cartItemQuantity);

   const item = {
      name: newBtn.parentElement.querySelector("#item-name").textContent,
      price: newBtn.parentElement.querySelector("#item-price").textContent,
   };

   addNewItemToCart(item);
};

const changeToBasicBtn = (btn) => {
   const basicBtn = document.createElement("button");
   basicBtn.classList.add(
      "flex",
      "justify-center",
      "items-center",
      "absolute",
      "bg-white",
      "left-1/2",
      "-translate-x-1/2",
      "bottom-[25%]",
      "rounded-3xl",
      "px-8",
      "py-3",
      "font-semibold",
      "whitespace-nowrap",
      "border-1",
      "border-gray-800",
      "lg:bottom-[35%]",
      "xl:bottom-[28%]",
      "cursor-pointer"
   );
   basicBtn.innerHTML = `
          <img src="/img/icon-add-to-cart.svg" class="w-[20px] mr-2" />Add to Cart
      `;
   basicBtn.addEventListener("click", () => {
      changeBtn(basicBtn); // Changed to pass basicBtn instead of btn
   });
   btn.replaceWith(basicBtn);
};

allAddBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
      changeBtn(btn);
   });
});

const increaseQuantity = (e) => {
   const plus = e.target; // Kliknięty przycisk
   const quantitySpan = plus.parentElement.querySelector(".item-quantity");
   let quantity = parseInt(quantitySpan.textContent);
   quantity++;
   quantitySpan.textContent = quantity;
   cartItemQuantity++;
   handleCarts(cartItemQuantity);

   const itemToUpdate = {
      name: e.target.parentElement.parentElement.querySelector("#item-name").textContent,
      price: e.target.parentElement.parentElement.querySelector("#item-price").textContent,
   };

   increaseItemInCart(itemToUpdate);
};

const decreaseQuantity = (e) => {
   const minus = e.target;
   const quantitySpan = minus.parentElement.querySelector(".item-quantity");
   let quantity = parseInt(quantitySpan.textContent);
   if (quantity > 1) {
      quantity--;
      quantitySpan.textContent = quantity;
      cartItemQuantity--;
      handleCarts(cartItemQuantity);

      const itemToUpdate = {
         name: e.target.parentElement.parentElement.querySelector("#item-name").textContent,
         price: e.target.parentElement.parentElement.querySelector("#item-price").textContent,
      };

      decreaseItemInCart(itemToUpdate);
   } else {
      const itemToDelete = {
         name: e.target.parentElement.parentElement.querySelector("#item-name").textContent,
      };

      const btn = minus.parentElement;
      changeToBasicBtn(btn);
      cartItemQuantity -= 1;

      // Teraz wywołaj usunięcie
      deleteItem(itemToDelete);
      handleCarts(cartItemQuantity);
   }
};

const handleCarts = (cartQuantity) => {
   const quantityText = document.querySelector(".all-items");
   quantityText.textContent = `(${cartQuantity})`;

   if (cartQuantity > 0) {
      emptyCart.classList.remove("flex");
      emptyCart.classList.add("hidden");

      cart.classList.remove("hidden");
      cart.classList.add("flex");
   } else {
      emptyCart.classList.add("flex");
      emptyCart.classList.remove("hidden");

      cart.classList.add("hidden");
      cart.classList.remove("flex");

      cart.querySelector("#cart-items").innerHTML = "";
   }
};

// funkcja do dodania stricte nowego produktu
const addNewItemToCart = (item) => {
   const cartItems = cart.querySelector("#cart-items");

   // Tworzymy nowy przedmiot
   const newItem = document.createElement("div");
   newItem.id = "cart-item";
   newItem.classList.add("flex", "justify-between", "items-center", "border-b-gray-300", "border-b-1", "py-3");

   newItem.innerHTML = `
       <div class="box">
           <p class="font font-semibold">${item.name}</p>
           <p>
               <span id="quantity">1x</span>
               <span id="price-per-product">@ ${item.price}</span>
               <span id="full-price">${item.price}</span>
           </p>
       </div>
       <img src="./img/icon-remove-item.svg" class="w-[25px] rounded-[50%] p-1 border-1 border-amber-950" />
   `;

   newItem.dataset.price = item.price.replace("$", "");

   cartItems.appendChild(newItem);
};

//  funkcja do dodawania kolejnych tych samych produktów
const increaseItemInCart = (item) => {
   const cartItems = cart.querySelector("#cart-items");
   const items = cartItems.querySelectorAll("#cart-item");

   // Przypisujemy istniejący przedmiot (zakładamy, że już istnieje)
   const existingItem = [...items].find((cartItem) => cartItem.querySelector(".box p").textContent.includes(item.name));

   const itemQ = existingItem.querySelector("#quantity");
   const itemP = existingItem.querySelector("#full-price");

   let itemQuantity = parseInt(itemQ.textContent) + 1;
   const itemPrice = parseFloat(existingItem.dataset.price);
   let newFullPrice = itemPrice * itemQuantity;

   itemQ.textContent = `${itemQuantity}x`;
   itemP.textContent = `$${newFullPrice.toFixed(2)}`;
};

const decreaseItemInCart = (item) => {
   const cartItems = cart.querySelector("#cart-items");
   const items = cartItems.querySelectorAll("#cart-item");

   // Przypisujemy istniejący przedmiot (zakładamy, że już istnieje)
   const existingItem = [...items].find((cartItem) => cartItem.querySelector(".box p").textContent.includes(item.name));

   const itemQ = existingItem.querySelector("#quantity");
   const itemP = existingItem.querySelector("#full-price");

   let itemQuantity = parseInt(itemQ.textContent) - 1;
   const itemPrice = parseFloat(existingItem.dataset.price);
   let newFullPrice = itemPrice * itemQuantity;

   itemQ.textContent = `${itemQuantity}x`;
   itemP.textContent = `$${newFullPrice.toFixed(2)}`;
};

const deleteItem = (item) => {
   const cartItems = cart.querySelector("#cart-items");
   const items = cartItems.querySelectorAll("#cart-item");
   const existingItem = [...items].find((cartItem) => cartItem.querySelector(".box p").textContent.includes(item.name));

   cartItems.removeChild(existingItem);
};
