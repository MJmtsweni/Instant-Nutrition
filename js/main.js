/***function to hide and display extra product information*****/
var texts = document.getElementsByClassName("card-text");
   var links = document.getElementsByClassName("here");
function viewContent1(){
   
   if (texts[0].style.display == "" || texts[0].style.display == "none"){
    
    texts[0].style.display = "block";
    links[0].innerHTML ="Less Details";
    
}else if(texts[0].style.display =="block") {
    texts[0].style.display = "none";
    links[0].innerHTML ="More Details";
    
}  
 
 }

 function viewContent2(){
    
    if (texts[1].style.display == "" || texts[1].style.display == "none"){
    
        texts[1].style.display = "block";
        links[1].innerHTML ="Less Details";
        
    }else if(texts[1].style.display =="block") {
        texts[1].style.display = "none";
        links[1].innerHTML ="More Details";
        
    }
}
function viewContent3(){
    
    if (texts[2].style.display == "" || texts[2].style.display == "none"){
    
        texts[2].style.display = "block";
        links[2].innerHTML ="Less Details";
        
    }else if(texts[2].style.display =="block") {
        texts[2].style.display = "none";
       links[2].innerHTML ="More Details";
        
    }
}
function viewContent4(){
   
    if (texts[3].style.display == "" || texts[3].style.display == "none"){
    
        texts[3].style.display = "block";
        links[3].innerHTML ="Less Details";
        
    }else if(texts[3].style.display =="block") {
        texts[3].style.display = "none";
        links[3].innerHTML ="More Details";
        
    }
}
function viewContent5(){
    
    if (texts[4].style.display == "" || texts[4].style.display == "none"){
    
        texts[4].style.display = "block";
        links[4].innerHTML ="Less Details";
        
    }else if(texts[4].style.display =="block") {
        texts[4].style.display = "none";
        links[4].innerHTML ="More Details";
        
    }
}
function viewContent6(){
    
    if (texts[5].style.display == "" || texts[5].style.display == "none"){
    
        texts[5].style.display = "block";
        links[5].innerHTML ="Less Details";
        
    }else if(texts[5].style.display =="block") {
        texts[5].style.display = "none";
        links[5].innerHTML ="More Details";
        
    }
}

// Shopping Cart functions 
//variables 
const cartBtn = document.querySelector(".cart-icon");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//main cart
let cart = [];
//buttons
let buttonsDOM = [];
//getting products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image};
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
//Displaying the products
class UI {
    getBagButtons(){

        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart ){
                button.innerText = "Product Added";
                button.disabled = true;
            }
            
                button.addEventListener("click", (event)=> {
                    event.target.innerText = " Product Added";
                    event.target.disabled = true;
                    //get product from products array
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    //add product to the cart
                    cart = [...cart, cartItem];
                    //save to local storage
                    Storage.saveCart(cart);
                    //update cart values
                    this.setCartValues(cart);
                    //update cart item
                    this.addCartItem(cartItem);
                    //showcart
                   this.showCart();
                     

                });
            
        });
        
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
       
       }  
     addCartItem(item){
         const div = document.createElement("div");
         div.classList.add('cart-item');
         div.innerHTML =` <img src=${item.image} alt="">
         <div>
           <h4>${item.title}</h4>
         <h5>R${item.price}</h5>
         <span class="remove-item" data-id=${item.id}>Remove</span>
         </div>
         <div>
           <i class="fa fa-chevron-up" data-id=${item.id}></i>
           <p class="item-amount">${item.amount}</p>
           <i class="fa fa-chevron-down" data-id=${item.id}></i>
         </div>`;
         cartContent.appendChild(div);
         
     }   
    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showcart");
    } 
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart)
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showcart");
    }
    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener("click", ()=>{
            this.clearCart();
        });
        //cart functionality
        cartContent.addEventListener("click", event=>{
            if(event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
               cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
               
            }
        });
    }
    clearCart(){
      let cartItems = cart.map(item => item.id) ;
      cartItems.forEach(id => this.removeItem(id));
      console.log(cartContent.children);
      while(cartContent.children.length > 0){
          cartContent.removeChild(cartContent.children[0])
      }
      this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerText = "Add to basket";
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
 }       
    


//local storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id) {
       let products = JSON.parse(localStorage.getItem('products'));
       return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
    //setup App
    ui.setupAPP();
    //get all products
    products.getProducts().then(products =>{
        Storage.saveProducts(products);
    } ).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});

