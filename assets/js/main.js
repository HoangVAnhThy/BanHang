const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const customerAPI = 'http://localhost:8080/customer';
const registerAPI = 'http://localhost:8080/register';
const loginAPI = 'http://localhost:8080/login';
const productsAPI = 'http://localhost:8080/products';


function start(){
  renderLoginSide();
}

function renderLoginSide(){
  var notLogin = document.querySelector(".header__navbar-item-not-login");
  var login = document.querySelector(".header__navbar-item-login");
  var username = document.querySelector(".header__navbar-user-name-text");
  if(getCookie("accessToken") == ""){
   notLogin.classList.add("header__navbar-item-not-login--active");
   login.classList.remove("header__navbar-item-login--active");
  }
  else{
    login.classList.add("header__navbar-item-login--active");
    notLogin.classList.remove("header__navbar-item-not-login--active");
    var payload = parseJwt(getCookie("accessToken"));
    username.innerText = payload.sub;
    if(window.location.href != "http://127.0.0.1:5500/cart.html"){
      getCart(renderCart);
    }
  }
}

start();

function displayRegisForm() {
  var modal = document.querySelector(".modal");
  var regisForm = document.querySelector(".auth-form.auth-form-regis");
  var loginForm = document.querySelector(".auth-form.auth-form-login");
  modal.classList.add("modal--active");
  regisForm.classList.add("auth-form--active");
  loginForm.classList.remove("auth-form--active");
}

function displayLoginForm() {
  var modal = document.querySelector(".modal");
  var loginForm = document.querySelector(".auth-form.auth-form-login");
  var regisForm = document.querySelector(".auth-form.auth-form-regis");
  modal.classList.add("modal--active");
  loginForm.classList.add("auth-form--active");
  regisForm.classList.remove("auth-form--active");
}

function displayPopup(){
  var popup = document.querySelector(".popup");
  popup.classList.add("popup--active");
}

function cancelPopup(){
  var popup = document.querySelector(".popup");
  popup.classList.remove("popup--active");
  var regis = document.querySelector(".popup__regis");
  var login = document.querySelector(".popup__login");
  regis.classList.remove("popup__regis--active");
  login.classList.remove("popup__login--active");
  handleBackAuthForm();
  setTimeout(renderLoginSide,200);
}

function handleBackAuthForm() {
  var modal = document.querySelector(".modal");
  var regis = document.querySelector(".auth-form-regis");
  var login = document.querySelector(".auth-form-login");
  regis.classList.remove("auth-form--active");
  login.classList.remove("auth-form--active");
  modal.classList.remove("modal--active");
  var username = document.querySelector('input[name="username"]');
  var password = document.querySelector('input[name="password"]');
  var rePasswrod = document.querySelector('input[name="rePassword"]');
  var errorRePasswordMessage = document.querySelector('.auth-form__error-re-password-message');
  var errorUsernameMessage = document.querySelector('.auth-form__error-username-message');
  password.classList.remove("input-error");
    rePasswrod.classList.remove("input-error");
    username.classList.remove("input-error");
    errorUsernameMessage.classList.remove("auth-form__error-message--active");
    errorRePasswordMessage.classList.remove("auth-form__error-message--active");
}

function handleRegisForm() {
  var loginPopup = document.querySelector(".popup__login");
  var regisPopup = document.querySelector(".popup__regis");
  var username = document.querySelector('input[name="username"]');
  var password = document.querySelector('input[name="password"]');
  var rePasswrod = document.querySelector('input[name="rePassword"]');
  var errorRePasswordMessage = document.querySelector('.auth-form__error-re-password-message');
  var errorUsernameMessage = document.querySelector('.auth-form__error-username-message');
  if(username.value.length < 6 || username.value.length > 20){
    username.classList.add("input-error");
    errorUsernameMessage.classList.add("auth-form__error-message--active");
  }
  else if(password.value != rePasswrod.value){
    password.classList.add("input-error");
    rePasswrod.classList.add("input-error");
    errorRePasswordMessage.classList.add("auth-form__error-message--active");
  }
  else{
    password.classList.remove("input-error");
    rePasswrod.classList.remove("input-error");
    username.classList.remove("input-error");
    errorUsernameMessage.classList.remove("auth-form__error-message--active");
    errorRePasswordMessage.classList.remove("auth-form__error-message--active");
    var formDataUser = {
      username: username.value,
      password: password.value
    }
    regisUser(formDataUser,registerAPI);
    displayPopup();
    loginPopup.classList.remove("popup__login--acitve");
    regisPopup.classList.add("popup__regis--active");
  }
}

function handleYesRegisPopup(){
  var username = document.querySelector('input[name="username"]').value;
  var password = document.querySelector('input[name="password"]').value;

  console.log(username);
  var formData = {
    username: username,
    password: password
  }
  login(formData,loginAPI);
  if(window.location.href == "http://127.0.0.1:5500/cart.html"){
    cancelCartPopup();
  }
  else{
    cancelPopup();
  }
}


function regisUser(data, api) {
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(api,options)
    .then(function(response){
      response.json();
    })
}

function handleLogin(){
  var username = document.querySelector('input[name="usernameLogin"]').value;
  var password = document.querySelector('input[name="passwordLogin"]').value;
  var formDataLogin = {
    username: username,
    password: password
  }
  login(formDataLogin,loginAPI);
}

function handleLogout(){
  setCookie("accessToken","",0);
  window.location = "http://127.0.0.1:5500/home.html"
}

function login(data,api){
  var loginPopup = document.querySelector(".popup__login");
  var regisPopup = document.querySelector(".popup__regis");
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  fetch(api, options)
    .then(function(response){
      if(response.ok){
        return response.json();
      }
    })
    .then(function(result){
      setCookie("accessToken",result.accessToken, 3);
      displayPopup();
        loginPopup.classList.add("popup__login--active");
        regisPopup.classList.remove("popup__regis--active");
    })
    .catch(function(error){
      alert("Username hoặc password sai");
    })
}

// Hàm thiết lập Cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

// Hàm lấy Cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

//Lấy payload token
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Cart

function getCart(callback){
  var payload = parseJwt(getCookie("accessToken"));
  const cartAPI = "http://localhost:8080/user/cart/"+payload.sub;
  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ getCookie("accessToken"),
    },
  };
  fetch(cartAPI, options)
    .then(function(response){
        return response.json();
  })
  .then(callback);
}

function renderCart(products){
  var cart = document.querySelector(".header__cart-list");
  if(products.length !=0){
    var cartNotice = document.querySelector(".header__cart-notice");
    cart.classList.remove("header__cart-list--no-cart");
    cart.classList.add("header__cart-list--has-cart");
    var listCart = document.querySelector(".header__cart-list-item");
    var html = products.map(function(item){
      return `
      <li class="header__cart-item" id="${item.product.maMH}">
          <img src="${item.product.image}" alt="" class="header__cart-img">
        <div class="header__cart-item-info">
          <div class="header__cart-item-head">
            <h5 class="header__cart-item-name">${item.product.tenMH}</h5>
               <div class="header__cart-item-price-wrap">
                 <span class="header__cart-item-price">${item.product.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}đ</span>
                    <span class="header__cart-item-multiply">x</span>
                         <span class="header__cart-item-qnt">${item.soLuongMua}</span>
                    </div>
                  </div>
              <div class="header__cart-item-body">
              <span class="header__cart-item-description">
                            Phân loại: ${item.product.productCategory.tenLoai}
               </span>
               <span class="header__cart-item-remove" onclick="handleDeleteCart(event)">Xóa</span>
             </div>
           </div>
         </li>
      `
    })
    cartNotice.classList.add("header__cart-notice--active");
    cartNotice.innerText = products.length;
    listCart.innerHTML = html.join('');
  }
  else {
    cart.classList.add("header__cart-list--no-cart");
    cart.classList.remove("header__cart-list--has-cart");
  }
}

function handleDeleteCart(e){
    var productId = e.target.parentNode.parentNode.parentNode.id;
    var payload = parseJwt(getCookie("accessToken"));
    const deleteCartAPI = 'http://localhost:8080/user/cart/'+payload.sub+'/delete/'+productId
    deleteCartItem(deleteCartAPI,renderCart);
}

function deleteCartItem(deleteAPI,callback){
  var options = {
    method: 'DELETE',
    headers:{
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer '+ getCookie("accessToken")
    },
};
fetch(deleteAPI, options)
.then(function(response){
    response.json();
})
.then(function(){
  getCart(callback);
});
}

function getProductSearch(searchAPI,callback){
  fetch(searchAPI)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}


function handleSearch(){
  var searchString = document.querySelector('input[name="search-product"]').value;
  var searchEncode = encodeURI(searchString);
  var searchAPI = "http://localhost:8080/product/search?string="+searchEncode;
  if(window.location.href != "http://127.0.0.1:5500/home.html"){
     window.location.assign("http://127.0.0.1:5500/home.html?string="+searchEncode);
  }
  getProductSearch(searchAPI,renderProduct);
}

function getUser(callback){
  var payload = parseJwt(getCookie("accessToken"));
  const userAPI = "http://localhost:8080/user/"+payload.sub;
  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ getCookie("accessToken"),
    },
  };
  fetch(userAPI, options)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function handleBackPayForm(){
  var modal = document.querySelector(".modal");
 modal.classList.remove("modal--active");
 var addressForm = document.querySelector(".auth-form-address");
 var paymentForm = document.querySelector(".auth-form-payment");
 addressForm.classList.remove("auth-form-address--active");
 paymentForm.classList.remove("auth-form-payment--active");

}

function handleDisplayPaymentModal(){
 var modal = document.querySelector(".modal");
 var addressForm = document.querySelector(".auth-form-address");
 modal.classList.add("modal--active");
 addressForm.classList.add("auth-form-address--active");
}

function handleNextToPayment(){
 var addressForm = document.querySelector(".auth-form-address");
 var paymentForm = document.querySelector(".auth-form-payment");
 var address = document.querySelector('.auth-form-address input[name="address"]').value;
 var phone = document.querySelector('.auth-form-address input[name="phone"]').value;
 setCookie("address",address,1);
 setCookie("phone",phone,1);
 addressForm.classList.remove("auth-form-address--active");
 paymentForm.classList.add("auth-form-payment--active");
}

// function test(){
  // var options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer '+ getCookie("accessToken"),
  //   },
  // };
  // fetch(productsAPI, options)
  //   .then(function(response){
  //       return response.json();
  //   })
  //   .then(function(result){
  //     console.log(result);
  //   })
// }
