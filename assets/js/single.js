
const ProductDetailAPI = "http://localhost:8080/product/"+urlParams.get("maMH");
const addCartAPI = "http://localhost:8080/user/cart/add";
var titleName = document.querySelector(".product-detail__des-title");
    var price = document.querySelector(".product-detail__price");
    var quantity = document.querySelector(".product-detail__des-info-quantity-remain");
    var img = document.querySelector(".product-detail__img");

function singleStart(){
  getProductDetail(renderProductDetail);
}
singleStart();

function getProductDetail(callback){
  fetch(ProductDetailAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}
function handleQuantityInput(e){
  var quantityNumber = parseInt(quantity.innerText.charAt(0),10);
  if(e.target.value < 1 || e.target.value == null){
    e.target.value = 1; 
  }
  if( e.target.value >quantityNumber){
    e.target.value = quantityNumber;
  }
}

function increaseCount(e) {
  var quantityNumber = parseInt(quantity.innerText.charAt(0),10);
  var input = e.target.previousElementSibling;
  var value = parseInt(input.value, 10);
  if(value < quantityNumber)
  {
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
  }
}

function decreaseCount(e) {
  var input = e.target.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}



function renderProductDetail(product){
    titleName.innerText = product.tenMH;
    price.innerText = product.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".") +"đ";
    quantity.innerText = product.soLuong+" sản phẩm có sẵn";
    img.src = product.image;
}

function handleAddCart(){
  var soLuongConLai = parseInt(quantity.innerText.charAt(0),10);
  var soLuong = parseInt(document.querySelector('input[name="quantity"]').value,10);
  if(getCookie("accessToken")==""){
    displayLoginForm();
  }
  else{
    getProductCart(function(cart){
      if((cart.soLuongMua+soLuong)>soLuongConLai){
        displayErrorPopupCart();
        setTimeout(unDisplayErrorPopupCart,2500);
      }
      else{
        var formData = {};
        getProductDetail(function(product){
          formData = {
            soLuongMua:soLuong,
            cartKey:{},
            product:product
          }
          getUser(function(user){
            formData = {
              ...formData,
              user:user
            }
            addCart(formData);
            displayPopupCart();
            setTimeout(unDisplayPopupCart,2500);
          });
        });
    
      }
    })
  }
}

function displayPopupCart(){
  var popupBlock = document.querySelector(".popup");
  var popupCart = document.querySelector(".popup__cart-success");
  popupBlock.classList.add("popup--active","popup--transparent");
  popupCart.classList.add("popup__cart-success--active");
}

function unDisplayPopupCart(){
  var popupBlock = document.querySelector(".popup");
  var popupCart = document.querySelector(".popup__cart-success");
  popupBlock.classList.remove("popup--active","popup--transparent");
  popupCart.classList.remove("popup__cart-success--active");
}

function addCart(data){
  var options = {
    method: 'POST',
    headers:{
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer '+ getCookie("accessToken")
    },
    body: JSON.stringify(data)
}
fetch(addCartAPI, options)
.then(function(response){
    response.json();
})
.then(function(){
  getCart(renderCart);
})
}

function getProductCart(callback){
  var soLuong = parseInt(document.querySelector('input[name="quantity"]').value,10);
  var payload = parseJwt(getCookie("accessToken"));
  const cartProductAPI = "http://localhost:8080/user/cart/"+payload.sub+"/"+urlParams.get("maMH");
  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ getCookie("accessToken"),
    },
  };
  fetch(cartProductAPI, options)
    .then(function(response){
      if(response.ok){
        return response.json();
      }
      else if(response.status === 404){
        var formData = {};
      getProductDetail(function(product){
        formData = {
          soLuongMua:soLuong,
          cartKey:{},
          product:product
        }
        getUser(function(user){
          formData = {
            ...formData,
            user:user
          }
          addCart(formData);
          displayPopupCart();
          setTimeout(unDisplayPopupCart,2500);
        });
      });
      }
      else{
        return Promise.reject('Something went wrong: ' + response.status)
      }
  })
  .then(callback)
  .catch(function(error){
    console.log(error);
  })
}


function displayErrorPopupCart(){
  var popupBlock = document.querySelector(".popup");
  var popupCart = document.querySelector(".popup__cart-fail");
  popupBlock.classList.add("popup--active","popup--transparent");
  popupCart.classList.add("popup__cart-fail--active");
}

function unDisplayErrorPopupCart(){
  var popupBlock = document.querySelector(".popup");
  var popupCart = document.querySelector(".popup__cart-fail");
  popupBlock.classList.remove("popup--active","popup--transparent");
  popupCart.classList.remove("popup__cart-fail--active");
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

function handlePayment(){
  var payload = parseJwt(getCookie("accessToken"));
  var quantity = document.querySelector('input[name="quantity"]').value;
  var orderAPI = "http://localhost:8080/order/"+payload.sub+"/"+urlParams.get("maMH")+"/"+quantity;
  var tongTien = 0;
  var trangThai = "Đang giao";
  var formData = {};
  getProductDetail(function(product){
    tongTien = product.gia*quantity;
    formData = {
      trangThai: trangThai,
      tongTien: tongTien,
      address: getCookie("address"),
      phoneContact: getCookie("phone")
    }
    createOrder(orderAPI,formData);
  })
  var paymentForm = document.querySelector(".auth-form-payment");
  paymentForm.classList.remove("auth-form-payment--active");
  var modal = document.querySelector(".modal");
  modal.classList.remove("modal--active");
}

function createOrder(orderAPI,data){
  var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ getCookie("accessToken"),
    },
    body: JSON.stringify(data)
};
fetch(orderAPI, options)
    .then(function (response) {
        response.json();
        alert("Thanh toán thành công, Đơn hàng của bạn sẽ được giao sớm nhất có thể ^^");
    })
    .catch(function(){
      alert("Something went wrong");
    })
}
