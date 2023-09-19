cartStart();

function cartStart(){
  if(getCookie("accessToken")!=""){
    getCart(renderCartPage);
  }
}

function increaseCount(e) {
  var input = e.target.previousElementSibling;
  var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
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

function handleControlSelectAll(){
  document.querySelectorAll(".check-box-cart").forEach(function(item){
    item.checked = true;
  })
}


function countProduct(){
  var countProduct = document.querySelectorAll(".cart-list__info-list").length;
    var countCheckedList = document.querySelectorAll(".cart-list__info-list .check-box-cart");
    var countChecked = 0 ;
    countCheckedList.forEach(element => {
      if(element.checked == true){
        countChecked++;
      }
    });
    var selectAllEle = document.querySelector(".cart-list__action-control-select-all");
    var totalPriceLabelEle = document.querySelector(".cart-list__total-price-label");
    selectAllEle.textContent = "Chọn tất cả (" +countProduct+ ")";
    totalPriceLabelEle.textContent = "Tổng thanh toán ("+countChecked+" Sản phẩm):"
}

function handleCheckBoxProduct(e){
    var titleCheckBox = document.querySelector('.cart-list__title-item.cart-list__item-checkbox input[class="check-box-cart"]');
    var bottomCheckBoxAll = document.querySelector('.cart-list__action-check-box input[class="check-box-cart"]');
    if(e.target.checked == false){
    titleCheckBox.checked = false;
    bottomCheckBoxAll.checked = false;
    }
    var flag=0;
    var listCheckBoxProduct = document.querySelectorAll(".cart-list__info-item.cart-list__item-checkbox input[class='check-box-cart']");
    listCheckBoxProduct.forEach(function(item){
      if(item.checked == true){
        flag++;
      }
    })
    if(flag == listCheckBoxProduct.length){
    titleCheckBox.checked = true;
    bottomCheckBoxAll.checked = true;
    }
    countProduct();
    setTotalPrice();
}

function handleCheckBoxAll(e){
    if(e.target.checked == true){
        document.querySelectorAll(".check-box-cart").forEach(function(item){
            item.checked = true;
        })
    }
    else {
        document.querySelectorAll(".check-box-cart").forEach(function(item){
            item.checked = false;
        })
    }
    countProduct();
    setTotalPrice();
}

function handleIncreaseCountCart(e) {
    increaseCount(e);
    var input = e.target.previousElementSibling;
    var totalPricePerUnit = e.target.parentNode.nextElementSibling.firstElementChild;
    var unitPrice = e.target.parentNode.previousElementSibling.firstElementChild;
    var temp = unitPrice.textContent.split(".").join("");
    var unitPriceValue = parseInt(temp, 10);
    var totalPricePerUnitValue = unitPriceValue * input.value;
    // Add dot between 3 digit
    totalPricePerUnit.textContent = totalPricePerUnitValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setTotalPrice();
  }
  
  // Handle total Price at Bottom
  function setTotalPrice() {
    var CheckedList = document.querySelectorAll(".cart-list__info-list .check-box-cart");
    var totalPrice = document.querySelector(".cart-list__total-price-value");
    var totalPriceValue = 0;
    CheckedList.forEach(element => {
      if(element.checked == true){
        var itemValue = 
        element.parentNode.parentNode.lastElementChild.previousElementSibling.firstElementChild.textContent.split(".").join("");
        totalPriceValue = totalPriceValue + parseInt(itemValue, 10);
      }
    });
    totalPrice.textContent = totalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // var totalPriceValue = 0;
    // var totalPrice = document.querySelector(".cart-list__total-price-value");
    // document.querySelectorAll(".cart-list__info-price").forEach(function (item) {
    //   var itemValue = item.textContent.split(".").join("");
    //   totalPriceValue = totalPriceValue + parseInt(itemValue, 10);
    // });
    // totalPrice.textContent = totalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  function handleDecreaseCountCart(e) {
    var input = e.target.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
      value = isNaN(value) ? 0 : value;
      value--;
      input.value = value;
      var totalPricePerUnit = e.target.parentNode.nextElementSibling.firstElementChild;
      var unitPrice = e.target.parentNode.previousElementSibling.firstElementChild;
      var temp = unitPrice.textContent.split(".").join("");
      var unitPriceValue = parseInt(temp, 10);
      var totalPricePerUnitValue = unitPriceValue * input.value;
      // Add dot between 3 digit
      totalPricePerUnit.textContent = totalPricePerUnitValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setTotalPrice();
    }
  }
  
  function setBackValueQuantity(e) {
    if (e.target.value < 1 || e.target.value == null) {
      e.target.value = 1;
    }
    var input = e.target;
    var totalPricePerUnit = e.target.parentNode.nextElementSibling.firstElementChild;
    var unitPrice = e.target.parentNode.previousElementSibling.firstElementChild;
    var temp = unitPrice.textContent.split(".").join("");
    var unitPriceValue = parseInt(temp, 10);
    var totalPricePerUnitValue = unitPriceValue * input.value;
    totalPricePerUnit.textContent = totalPricePerUnitValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setTotalPrice();
  }


function renderCartPage(items){
  var noCart = document.querySelector(".cart-list__no-cart");
  var hasCart = document.querySelector(".cart-list__has-cart");
  console.log(items.length);
  if(items.length !=0){
    noCart.classList.remove("cart-list__no-cart--active");
    hasCart.classList.add("cart-list__has-cart--active");
    var listProductBlock = document.querySelector(".cart-list__list-product");
    var html = items.map(function(item){
      return`
      <ul class="cart-list__info-list" id="${item.product.maMH}">
        <li class="cart-list__info-item cart-list__item-checkbox">
            <input type="checkbox" class="check-box-cart" onchange="handleCheckBoxProduct(event)">
        </li>
        <li class="cart-list__info-item cart-list__item-product">
        <a href="./single.html?maMH=${item.product.maMH}" class="cart-list__info-item-product-link">
        <div class="cart-list__info-item-img" style="background-image: url(${item.product.image});"></div>
        </a>
        <a href="./single.html?maMH=${item.product.maMH}" class="cart-list__info-item-product-link">
        <div class="cart-list__info-text">${item.product.tenMH}</div> 
        </a>                             
        </li>
         <li class="cart-list__info-item price">
             <div class="cart-list__info-unit-price">${item.product.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}</div>
             <div class="cart-list__info-unit-valuation">đ</div>
          </li>
          <li class="cart-list__info-item cart-list__info-item-quantity-control">
              <button class="btn-decrease" onclick=handleDecreaseCountCart(event)>-</button>
              <input type="number" inputmode="numeric" class="product-detail__des-info-quantity" onchange="setBackValueQuantity(event)" value="${item.soLuongMua}">
              <button class="btn-increase" onclick=handleIncreaseCountCart(event)>+</button>
          </li>
          <li class="cart-list__info-item price">
               <div class="cart-list__info-price">${(item.product.gia*item.soLuongMua).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}</div>
               <div class="cart-list__info-valuation">đ</div>
           </li>
            <li class="cart-list__info-item">
                 <div class="cart-list__delete" onclick="handleDeleteCartPage(event)">Xóa</div>
            </li>
        </ul>
      `
    })
    listProductBlock.innerHTML = html.join('');
    countProduct();
    setTotalPrice();
  }
  else{
    noCart.classList.add("cart-list__no-cart--active");
    hasCart.classList.remove("cart-list__has-cart--active");
  }
}

function cancelCartPopup(){
  var popup = document.querySelector(".popup");
  popup.classList.remove("popup--active");
  handleBackAuthForm();
  setTimeout(renderLoginSide,200);
  setTimeout(getCart(renderCartPage),200);
}

function handleDeleteCartPage(e){
  var productId = e.target.parentNode.parentNode.id;
    var payload = parseJwt(getCookie("accessToken"));
    const deleteCartAPI = 'http://localhost:8080/user/cart/'+payload.sub+'/delete/'+productId
    deleteCartItem(deleteCartAPI,renderCartPage);
}

function handleDeleteAll(){
  var countCheckedList = document.querySelectorAll(".cart-list__info-list .check-box-cart");
  var confirmDeleteText = document.querySelector(".confirm-delete-all-cart-text");
  var countChecked = 0 ;
    countCheckedList.forEach(element => {
      if(element.checked == true){
        countChecked++;
      }
    });
    if(countChecked > 0 ){
      confirmDeleteText.innerText = "Bạn có muốn bỏ "+countChecked+" sản phẩm ra khỏi giỏ hàng không ?";
      var modal = document.querySelector(".modal");
      var confirmDelete = document.querySelector(".confirm-delete-all-cart");
      confirmDelete.classList.add("confirm-delete-all-cart--active");
      modal.classList.add("modal--active");
    }
    else{
      alert("Vui lòng chọn sản phẩm");
    }
}

function handleBackConfirmDelete(){
  var modal = document.querySelector(".modal");
  var confirmDelete = document.querySelector(".confirm-delete-all-cart");
  confirmDelete.classList.remove("confirm-delete-all-cart--active");
  modal.classList.remove("modal--active");
}

function handleYesConfirmDelete(){
  var CheckedList = document.querySelectorAll(".cart-list__info-list .check-box-cart");
  var payload = parseJwt(getCookie("accessToken"));
  CheckedList.forEach(async function(item){
    if(item.checked==true){
      var productId = item.parentNode.parentNode.id;
      const deleteCartAPI = 'http://localhost:8080/user/cart/'+payload.sub+'/delete/'+productId;
      deleteCartItem(deleteCartAPI,renderCartPage);
    }
  })
  handleBackConfirmDelete();
}


async function handleCreateOrderList(){
  var listCheckedProduct = document.querySelectorAll(".cart-list__info-list .check-box-cart:checked");
  var payload = parseJwt(getCookie("accessToken"));
  var quantity = 0;
  var productId = "";
  var trangThai = "";
  var formData = {};
  var tongTien = parseInt(document.querySelector(".cart-list__total-price-value").textContent.split(".").join(""),10);
  for(var i=0;i<listCheckedProduct.length;i++){
    quantity = listCheckedProduct[i].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.value;
    productId = listCheckedProduct[i].parentNode.parentNode.id;
    if(i==0){
      trangThai = "1";
      var createOrderAPI = "http://localhost:8080/order/"+payload.sub+"/"+productId+"/"+quantity;
      formData = {
      trangThai: trangThai,
      tongTien: tongTien,
      address: getCookie("address"),
      phoneContact: getCookie("phone")
      }
      var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessToken"),
        },
        body: JSON.stringify(formData)
    };
    await fetch(createOrderAPI, options)
        .then(function (response) {
          response.json();
          console.log("1");
        })
        .catch(function(){
          alert("Something went wrong");
        })
    }
    else if(i==listCheckedProduct.length-1){
      trangThai = "Đang giao";
      var changeOrderAPI = "http://localhost:8080/order/"+payload.sub+"/"+productId+"/"+quantity+"/1";
      formData = {
        trangThai:trangThai
      }
      var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessToken"),
        },
        body: JSON.stringify(formData)
    };
    await fetch(changeOrderAPI, options)
        .then(function (response) {
          response.json();
        })
        .catch(function(){
          alert("Something went wrong");
        })
    }
    else{
      var addOrderAPI = "http://localhost:8080/order/"+payload.sub+"/"+productId+"/"+quantity;
      var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessToken"),
        },
    };
    await fetch(addOrderAPI, options)
        .then(function (response) {
          response.json();
          console.log("2");
        })
        .catch(function(){
          alert("Something went wrong");
        })
    }
  }
  
  for(var i=0;i<listCheckedProduct.length;i++){
    productId = listCheckedProduct[i].parentNode.parentNode.id;
    const deleteCartAPI = 'http://localhost:8080/user/cart/'+payload.sub+'/delete/'+productId;
    deleteCartItem(deleteCartAPI,renderCartPage);
  }
  handleBackPayForm();
  alert("Đơn hàng của bạn sẽ giao sớm nhất có thể ^^");
  
}
//   var inputQuantity = document.querySelector(".product-detail__des-info-quantity")

//    inputQuantity.addEventListener("focusout",setBackValueQuantity);
