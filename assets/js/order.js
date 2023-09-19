
function start(){
    getOrder(renderOrder);
}

start();

function getOrder(callback){
    var payload = parseJwt(getCookie("accessToken"));
    const orderListAPI = "http://localhost:8080/order/"+payload.sub;
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessToken"),
        },
    };

    fetch(orderListAPI,options)
    .then(function(response){
        return response.json();
    })
    .then(callback);

}

function getOrderDetail(maHD, callback){
    var orderDetailListAPI = "http://localhost:8080/order/detail/"+maHD;
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessToken"),
        },
    };

    fetch(orderDetailListAPI,options)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderOrderDetail(products){
    var listProductOrderDetail = document.querySelector(".order-detail-container");
    var html = products.map(function(product){
        return `
        <ul class="order-detail__item-list">
                                    <li class="order-detail__item-list-item order-detail__item-list-item-product">
                                        <div class="order-detail__product-image" style="background-image: url(${product.productBill.image});"></div>
                                        <div class="order-detail__product-text">${product.productBill.tenMH}</div>
                                    </li>
                                    <li class="order-detail__item-list-item">
                                        ${product.productBill.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}đ
                                    </li>
                                    <li class="order-detail__item-list-item">
                                        ${product.soLuong}
                                    </li>
                                    <li class="order-detail__item-list-item order-detail__item-list-item--highlight">
                                        ${(product.soLuong*product.productBill.gia).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}đ
                                    </li>
                                    <li class="order-detail__item-list-item">
                                        
                                    </li>
        </ul>
        `
    })
    listProductOrderDetail.innerHTML = html.join('');
}

function renderOrder(orders){
    var listOrder = document.querySelector(".user-order__item-list-container");
    var html = orders.map(function(order){
        if(order.trangThai == "Đã hủy"){
            return `
        <ul class="user-order__item-list">
                                    <li class="user-order__item-list-item">
                                        <div class="user-order__item-list-item-link" onclick="handleLinkToDetail(event)">${order.maHD}</div>
                                    </li>
                                    <li class="user-order__item-list-item">
                                        ${order.ngayLap}
                                    </li>
                                    <li class="user-order__item-list-item user-order__item-list-item--highlight">
                                        ${order.tongTien.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}đ
                                    </li>
                                    <li class="user-order__item-list-item user-order__item-list-item--highlight">
                                        ${order.trangThai}
                                    </li>
                                    <li class="user-order__item-list-item">
                                    
                                    </li>
                                </ul>
        `
        }
        else{
            return `
            <ul class="user-order__item-list">
                                        <li class="user-order__item-list-item">
                                            <div class="user-order__item-list-item-link" onclick="handleLinkToDetail(event)">${order.maHD}</div>
                                        </li>
                                        <li class="user-order__item-list-item">
                                            ${order.ngayLap}
                                        </li>
                                        <li class="user-order__item-list-item user-order__item-list-item--highlight">
                                            ${order.tongTien.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}đ
                                        </li>
                                        <li class="user-order__item-list-item user-order__item-list-item--highlight">
                                            ${order.trangThai}
                                        </li>
                                        <li class="user-order__item-list-item">
                                            <div class="user-order__cancel" onclick="handleCancelOrder(event)">Hủy</div>
                                        </li>
                                    </ul>
            `

        }
    })

    listOrder.innerHTML = html.join('');
}

function handleLinkToDetail(e){
    var orderList = document.querySelector(".user-order__list");
    var maHD = e.target.textContent;
    getOrderDetail(maHD,renderOrderDetail)
    orderList.classList.add("user-order__item-list--inactive","order-detail__item-list--active");

}

function handleBackToOrder(){
    var orderList = document.querySelector(".user-order__list");
    orderList.classList.remove("user-order__item-list--inactive","order-detail__item-list--active");
}

function handleCancelOrder(e){
    if(confirm("Bạn có muốn hủy đơn hàng này không ?") == true){
        var maHD = e.target.parentNode.parentNode.firstElementChild.firstElementChild.textContent;
        var cancelOrderAPI = "http://localhost:8080/order/cancel/"+maHD;
        var options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ getCookie("accessToken"),
            },
        };
    
        fetch(cancelOrderAPI,options)
        .then(function(response){
            return response.json();
        })
        .then(function(){
            getOrder(renderOrder);
        })
    }
}