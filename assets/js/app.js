
var productsAPI = 'http://localhost:8080/products';

function start(){
    getProducts(renderProducts);
}

start();

function getProducts(callback){
    fetch(productsAPI)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderProducts(products){
    var listProductsBlock = document.querySelector('#list-products');
    var html = products.map(function(product){
        return `
        <tr>
            <td><a href="./updateMatHang.html" onclick=getId(event)>${product.maMH}</a></td>
            <td>${product.tenMH}</td>
            <td>${product.maLoai}</td>
            <td>${product.moTa}</td>
            <td>${product.soLuong}</td>
            <td>6</td>
            <td><button onclick="handleDeleteProduct('${product.maMH}')">Xóa</button></td>
        <tr>`
    })
    listProductsBlock.innerHTML = html.join('');
}

function createMatHang(){
    window.location = "./createMatHang.html";
}

function getId(event){
    var productId = event.target.textContent;
    localStorage.setItem("ProductId",productId);
}

function handleDeleteProduct(maMH){
    var options = {
        method: 'DELETE',
        headers:{
            'Content-Type' : 'application/json'
        },
    };
    fetch(productsAPI +'/'+maMH, options)
    .then(function(response){
        response.json();
    })
    .then(function(){
        getProducts(renderProducts);
    });
}



