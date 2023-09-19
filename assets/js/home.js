const productListAPI = 'http://localhost:8080/product';
const CategoryAPI = "http://localhost:8080/product-category";
const productCategoryAPI = "http://localhost:8080/product/category/"+urlParams.get("maLoai");
const createCustomerAPI = "http://localhost:8080/user/info";
const productPerPage = 15;

function homeStart(){
    if(urlParams.get("maLoai")!=null){
        getProductCategoryList(renderPaging);
        getProductCategoryPaging(renderProduct);
    }
    else if(urlParams.get("string")!=null){
        renderSearchProduct();
    }
    else{
        getProductList(renderPaging);
        getProductListPaging(renderProduct);
    }
    getCategoryList(renderCategory);
}

homeStart();
function getProductList(callback) {
    fetch(productListAPI)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function getProductListPaging(callback){
    var productListPagingAPI = "";
    if(urlParams.get('page') == null){
        productListPagingAPI = 'http://localhost:8080/product/page/1'
    }
    else{
        productListPagingAPI ='http://localhost:8080/product/page/'+urlParams.get("page");
    }
    fetch(productListPagingAPI)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function getCategoryList(callback) {
    fetch(CategoryAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}

function getProductCategoryList(callback){
    fetch(productCategoryAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}

function getProductCategoryPaging(callback){
    var productCategoryPagingAPI = "http://localhost:8080/product/category/"+urlParams.get("maLoai");
    if(urlParams.get("page")==null){
        productCategoryPagingAPI += "/page/1";
    }
    else{
        productCategoryPagingAPI += "/page/"+urlParams.get("page");
    }
    fetch(productCategoryPagingAPI)
    .then(function (response) {
        return response.json();
    })
    .then(callback);
}

function renderProduct(products) {
    var listProductBlock = document.querySelector(".home-product");
    listLenght = products.length;
    var gridRow = "";
    var flag = 1;
    for (var i = 0; i <= (listLenght - listLenght % 5) / 5; i++) {
        gridRow = gridRow + 
        `<div class="grid__row row-product-`+ flag +`">
        </div>
        `
        flag++;
    }
    flag = 1;
    listProductBlock.innerHTML = gridRow;
    var numberRow = (listLenght - listLenght % 5) / 5;
    if(listLenght % 5 == 0){
        numberRow = numberRow -1;
    }
    var row = "";
    var count = 0;
    for (var i = 0; i <= numberRow; i++) {
        row = document.querySelector(".home-product .grid__row.row-product-" + flag + "");
        let html = "";
        var hangSanXuatString = "";
        for (var j = 0; j < 5; j++) {
            if(products[count].hangSanXuat != null){
                hangSanXuatString = products[count].hangSanXuat;
            }
            html = html + `
            <div class="grid__column-2-4">
                <a href="./single.html?maMH=`+products[count].maMH+`" class="home-product-item">
                    <div class="home-product-item__img" style="background-image: url(`+products[count].image+`);"></div>
                    <h4 class="home-product-item__name">`+products[count].tenMH+`</h4>
                    <div class="home-product-item__price">
                        `+ products[count].gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".") +` đ
                    </div>
                    <div class="home-product-item__origin">
                        <span class="home-product-item__brand">`+hangSanXuatString+`</span>
                        <span class="home-product-item__origin-name">`+products[count].xuatXu+`</span>
                    </div>
                </a>
            </div>
            `
            count++;
            if(count>=listLenght){
                break;
            }
        }
        row.innerHTML = html;
        flag++;
    }

}

function renderCategory(productCategories){
    var listCategoryBlock = document.querySelector(".category-list");
    var html = productCategories.map(function(productCategory){
        return `
        <li class="category-item">
            <a href="./home.html?maLoai=${productCategory.maLoai}" class="category-item__link">${productCategory.tenLoai}</a>
        </li>
        `
    })
    listCategoryBlock.innerHTML = html.join('');
    handleActiveProductCategory();
}


function handleActiveProductCategory(){
    var categoryActive = document.querySelector('a[href="./home.html?maLoai='+urlParams.get("maLoai")+'"]');
    categoryActive.parentNode.classList.add("category-item--active");
}

function renderSearchProduct(){
    var searchAPI = "http://localhost:8080/product/search?string="+urlParams.get("string");
    var searchPagingAPI = "";
    if(urlParams.get("page") == null){
        searchPagingAPI = "http://localhost:8080/product/search/page/1?string="+urlParams.get("string");
    }
    else{
        searchPagingAPI = "http://localhost:8080/product/search/page/"+urlParams.get("page")+"?string="+urlParams.get("string");
    }
    getProductSearch(searchAPI,renderPaging);
    getProductSearch(searchPagingAPI,renderProduct);

}

function renderPaging(products){
    var pagination = document.querySelector(".pagination.home-product__pagination");
    var homeFilterPage = document.querySelector(".home-filter__page");
    var homeFilterPageTotal = document.querySelector(".home-filter__page-total");
    var homeFilterPageCurrent = document.querySelector(".home-filter__page-current");
    var homeFilterPagePrevious = document.querySelector(".home-filter__page-icon.fas.fa-angle-left");
    var homeFilterPageNext = document.querySelector(".home-filter__page-icon.fas.fa-angle-right");
    var html = "";
    var totalPage = 0;
    if(products.length % productPerPage == 0){
      totalPage = (products.length - products.length % productPerPage) / productPerPage;
    }
    else{
      totalPage = (products.length - products.length % productPerPage) / productPerPage +1;
    }
    if(totalPage > 1) {
        homeFilterPage.classList.add("home-filter__page--active");
        for(var i = 0; i<= totalPage+1; i++){
            if(i==0){
                    var previousLink = urlParams.get("page") - 1;
                    var url = new URL(window.location.href);
                    url.searchParams.delete('page');
                    url.searchParams.append('page',previousLink.toString());
                    html = html + `
                    <li class="pagination-item">
                                    <a href="`+url.toString()+`" class="pagination-item__link">
                                        <i class="pagiantion-item__icon fas fa-angle-left"></i>
                                    </a>
                                </li>
                    `
            }
            else if(i == totalPage+1){
                if(urlParams.get("page")==null){
                    var url = new URL(window.location.href);
                    url.searchParams.append('page','2');
                    html = html + `
                    <li class="pagination-item">
                                    <a href="`+url.toString()+`" class="pagination-item__link">
                                        <i class="pagiantion-item__icon fas fa-angle-right"></i>
                                    </a>
                                </li>
                    `
                }
                else{
                    var nextLink = parseInt(urlParams.get("page"),10) + 1;
                    var url = new URL(window.location.href);
                    url.searchParams.delete('page');
                    url.searchParams.append('page',nextLink.toString());
                    html = html + `
                    <li class="pagination-item">
                                    <a href="`+url.toString()+`" class="pagination-item__link">
                                        <i class="pagiantion-item__icon fas fa-angle-right"></i>
                                    </a>
                                </li>
                    `
                }
            }
            else{
                var url = new URL(window.location.href);
                    url.searchParams.delete('page');
                    url.searchParams.append('page',i.toString());
                html = html + `
                <li class="pagination-item">
                                <a href="`+url.toString()+`" class="pagination-item__link">
                                `+i+`
                                </a>
                </li>
                `
            }
        }
        pagination.innerHTML = html;
        var listPage = document.querySelectorAll(".pagination-item__link");
        var previousPage = document.querySelector(".pagiantion-item__icon.fas.fa-angle-left");
        var nextPage = document.querySelector(".pagiantion-item__icon.fas.fa-angle-right");
        if(urlParams.get("page") == null){
            var url = new URL(window.location.href);
            url.searchParams.append('page','2');
            homeFilterPageNext.parentNode.href = url.toString();
            homeFilterPageCurrent.innerText = "1";
            homeFilterPageTotal.innerText = "/"+totalPage;
            previousPage.parentNode.parentNode.classList.add("pagination-item--disable");
            homeFilterPagePrevious.parentNode.classList.add(("home-filter__page-btn--disable"));
            for ( var i = 0; i < listPage.length; i++){
                if(listPage[i].textContent.trim() == "1"){
                    listPage[i].parentNode.classList.add("pagination-item--active");
                    break;
                }
            }
        }
        else{
            var previousLink = urlParams.get("page") - 1;
            var urlPrevious = new URL(window.location.href);
            urlPrevious.searchParams.delete('page');
            urlPrevious.searchParams.append('page',previousLink.toString());
            var nextLink = parseInt(urlParams.get("page"),10) + 1;
            var urlNext = new URL(window.location.href);
            urlNext.searchParams.delete('page');
            urlNext.searchParams.append('page',nextLink.toString());
            homeFilterPagePrevious.parentNode.href = urlPrevious.toString();
            homeFilterPageNext.parentNode.href = urlNext.toString();
            homeFilterPageCurrent.innerText = urlParams.get("page");
            homeFilterPageTotal.innerText = "/"+totalPage;
            for ( var i = 0; i < listPage.length; i++){
                if(listPage[i].textContent.trim() == urlParams.get("page")){
                    listPage[i].parentNode.classList.add("pagination-item--active");
                    break;
                }
            }
        }
        if(urlParams.get("page")==1){
            homeFilterPagePrevious.parentNode.classList.add(("home-filter__page-btn--disable"));
            previousPage.parentNode.parentNode.classList.add("pagination-item--disable");
        }
        if(urlParams.get("page")==(listPage.length-2)){
            homeFilterPageNext.parentNode.classList.add("home-filter__page-btn--disable");
            nextPage.parentNode.parentNode.classList.add("pagination-item--disable");
        }
    }
}

