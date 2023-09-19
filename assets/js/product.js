const CategoryAPI = "http://localhost:8080/product-category";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var fileInput = document.querySelector("#imageUploadInput");
var fileTypes = ['image/png', 'image/jpeg'];
var maxSize = 30 * 1024 * 1024;
var imagePreview = document.querySelector('#imagePreview');
var statusImg = document.querySelector('#uploadFileStatus');
var imageData = "";
const ProductDetailAPI = "http://localhost:8080/product/"+urlParams.get("maMH");
var downloadImage = document.querySelector(".image-download");
const inputDiv = document.querySelector(".input-div");
const input = document.querySelector(".file");
const output = document.querySelector("output");
const inputImageText = document.querySelector(".input-image-text");
const addBtn = document.querySelector(".add-product-btn");
const updateBtn = document.querySelector(".update-product-btn");



input.addEventListener("change", () => {
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
      imageData = files[i];
    }
    var img = "./assets/img/"+files[0].name;
    console.log(img);
    setCookie("image",img,1);
    displayImages();
})

inputDiv.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.match("image")) 
      {
        continue;
    }
  
      if (imageData.name !== files[i].name){
          imageData = files[i];

      }
    }
    var img = "./assets/img/"+files[0].name;
    setCookie("image",img,1);
    displayImages();
  })

function displayImages() {
    let images = "";
      images = `<div class="image">
                  <img src="${URL.createObjectURL(imageData)}" alt="image">
                </div>`;
    output.innerHTML = images;
    output.classList.remove("hidden");
    inputImageText.classList.add("hidden");
  }

function ProductStart(){
    getCategoryList(renderProductCategorySelect);
    if(urlParams.get("maMH") !=null){
        getProduct(renderUpdateProduct);
        addBtn.classList.add("hidden");
        updateBtn.classList.remove("hidden");
    }
}

ProductStart();

function fileInputClick(){
    fileInput.click();
}

// function onChangeInput(event){
//     let file = event.target.files[0];
//     var img = "./assets/img/"+file.name;
//     setCookie("image",img,1);
//     imageData = '';
//     if (fileTypes.indexOf(file.type) == -1) {
//         statusImg.innerHTML = "File không hợp lệ (chỉ file hình jpg và hình png)";
//     }
//     if (file.size > maxSize) {
//         statusImg.innerHTML = "Dung lượng file vượt quá giới hạn (tối đa 30MB)";
//     }
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         imageData = e.target.result;

//         // Validate file content
//         imagePreview.onerror = function () {
//             imageData = "";
//             statusImg.innerHTML = 'Nội dung hình không hợp lệ';
//         };
//         imagePreview.setAttribute('src', self.imageData);
//     };
//     reader.readAsDataURL(file);
// }

function renderProductCategorySelect(items){
    var renderBlock = document.querySelector(".product-category");
    var html = items.map(function(item){
        return `
        <option value="${item.maLoai}">${item.tenLoai}</option>
        `
    })
    renderBlock.innerHTML = html.join('');
}

function getCategoryList(callback) {
    fetch(CategoryAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}

function handleAddProduct(){
    var tenMH = document.querySelector('input[name="tenMH"]').value;
    var maLoai = document.querySelector('.product-category').value;
    var gia = document.querySelector('input[name="gia"]').value;
    var soLuong = document.querySelector('input[name="soLuong"]').value;
    var hangSanXuat = document.querySelector('input[name="hangSanXuat"]').value;
    var xuatXu = document.querySelector('input[name="xuatXu"]').value;
    var image = getCookie("image");
    const addProductAPI = "http://localhost:8080/product/add/"+maLoai;
    var formData = {
        tenMH: tenMH,
        gia: gia,
        soLuong: soLuong,
        hangSanXuat: hangSanXuat,
        xuatXu: xuatXu,
        image: image
    }
    addProduct(addProductAPI,formData);
    alert("Thêm mặt hàng thành công");
}

function addProduct(API,data){
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(API, options)
        .then(function (response) {
            response.json();
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

function getProduct(callback){
    fetch(ProductDetailAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}

function renderUpdateProduct(product){
        document.querySelector('input[name="tenMH"]').value = product.tenMH;
        document.querySelector('.product-category').value = product.productCategory.maLoai;
        document.querySelector('input[name="gia"]').value = product.gia;
        document.querySelector('input[name="soLuong"]').value = product.soLuong;
        document.querySelector('input[name="hangSanXuat"]').value = product.hangSanXuat;
        document.querySelector('input[name="xuatXu"]').value = product.xuatXu;
        var images = `<div class="image">
                      <img src="${product.image}" alt="image">
                    </div>`;
        output.innerHTML = images;
        setCookie("image",product.image,1);
        output.classList.remove("hidden");
        inputImageText.classList.add("hidden");
}

function handleUpdateProduct(){
    var tenMH = document.querySelector('input[name="tenMH"]').value;
    var maLoai = document.querySelector('.product-category').value;
    var gia = document.querySelector('input[name="gia"]').value;
    var soLuong = document.querySelector('input[name="soLuong"]').value;
    var hangSanXuat = document.querySelector('input[name="hangSanXuat"]').value;
    var xuatXu = document.querySelector('input[name="xuatXu"]').value;
    var image = getCookie("image");
    const updateProductAPI = "http://localhost:8080/product/update/"+urlParams.get("maMH")+"/"+maLoai;
    var formData = {
        tenMH: tenMH,
        gia: gia,
        soLuong: soLuong,
        hangSanXuat: hangSanXuat,
        xuatXu: xuatXu,
        image: image
    }
    updateProduct(updateProductAPI,formData);
    alert("Update thành công");
}

function updateProduct(API,data){
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(API, options)
        .then(function (response) {
            response.json();
        })
}
