const productListAPI = 'http://localhost:8080/product';

function productManageStart(){
    getProductList(renderProductManagePage);
}

productManageStart();

function renderProductManagePage(products){
    var renderBlock = document.querySelector(".product-table__item");
    var hangSanXuat = "";
    var html = products.map(function(product){
        if(product.hangSanXuat != null){
            hangSanXuat = product.hangSanXuat;
        }
        return `
        <tr>
        <td><img class="product-image" src="${product.image}" alt=""></td>
                        <td>${product.maMH}</td>
                        <td>${product.tenMH}</td>
                        <td>${product.productCategory.tenLoai}</td>
                        <td>${product.gia}</td>
                        <td>${product.soLuong}</td>
                        <td>${hangSanXuat}</td>
                        <td>${product.xuatXu}</td>
                        <td>
                            <div class="product-table__control">
                            <a href="./product.html?maMH=${product.maMH}" class="admin-btn product-change">
                            Sửa
                        </a>
                        <div class="control-seperate">|</div>
                        <button class="admin-btn product-delete" onclick="handleDeleteProduct(event)">
                            Xóa
                        </button>
                            </div>
                        </td>
        </tr>
                        `
    })

    renderBlock.innerHTML = html.join('');
}

function getProductList(callback) {
    fetch(productListAPI)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function handleDeleteProduct(e){
    var maMH = e.target.parentNode.parentNode.parentNode.firstElementChild.nextElementSibling.textContent;
    var deleteProductAPI = "http://localhost:8080/product/delete/"+maMH;
    if(confirm("Bạn có chắc muốn xóa mặt hàng này ?")==true){
        var options = {
            method: 'DELETE',
            headers:{
                'Content-Type' : 'application/json'
            },
        };
        fetch(deleteProductAPI, options)
        .then(function(response){
            response.json();
        })
        .then(function(){
            getProductList(renderProductManagePage);
        });
    }
}