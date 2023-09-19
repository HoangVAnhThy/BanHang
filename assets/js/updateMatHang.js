function start(){
    let id = localStorage.getItem("ProductId");
    let productAPI = "http://localhost:8080/product/"+id;
    getProductById(renderProductById,productAPI);
}

start();

function getProductById(callback,productAPI){
    fetch(productAPI)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderProductById(product){
    document.querySelector('input[name="maMH"]').value = product.maMH;
    document.querySelector('input[name="tenMH"]').value = product.tenMH;
    document.querySelector('input[name="maLoai"]').value = product.maLoai;
    document.querySelector('input[name="moTa"]').value = product.moTa;
    document.querySelector('input[name="soLuong"]').value = product.soLuong;
}

function handleUpdate(){
    let maMH = document.querySelector('input[name="maMH"]').value;
    let tenMH = document.querySelector('input[name="tenMH"]').value;
    let maLoai = document.querySelector('input[name="maLoai"]').value;
    let moTa = document.querySelector('input[name="moTa"]').value;
    let soLuong = document.querySelector('input[name="soLuong"]').value;

    var formData = {
        maMh: maMH,
        tenMH: tenMH,
        maLoai: maLoai,
        moTa: moTa,
        soLuong: soLuong
    }
    updateMatHang(formData);
}

function updateMatHang(data){
    let id = localStorage.getItem("ProductId");
    let productAPI = "http://localhost:8080/product/"+id;
    var options = {
        method: 'PUT',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(productAPI, options)
    .then(function(response){
        response.json();
    })
}