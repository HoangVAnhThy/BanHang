const orderListAPI = "http://localhost:8080/order"


function orderAdminStart(){
    getOrderList(renderOrderAdminPage);
}

orderAdminStart();

function getOrderList(callback){
    var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
    },
  };
  fetch(orderListAPI, options)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderOrderAdminPage(orders){
    var renderBlock = document.querySelector(".product-table__item");
    var html = orders.map(function(order){
        if(order.trangThai != "Đã hủy" && order.trangThai != "Hoàn thành" ){

            return `
            <tr>
                            <td>${order.maHD}</td>
                            <td>${order.userBill.username}</td>
                            <td>${order.ngayLap}</td>
                            <td>${order.trangThai}</td>
                            <td>${order.tongTien}</td>
                            <td>${order.address}</td>
                            <td>${order.phoneContact}</td>
                            <td>
                                <div class="product-table__control">
                                    <button class="admin-btn order-status-change" onclick="handleChangeStatusOrder(event)">
                                        Xử lý đơn
                                    </button>
                                    <div class="control-seperate">|</div>
                                    <button href="" class="admin-btn order-status-cancel" onclick="handleCancelOrder(event)">
                                        Hủy đơn
                                    </button>
    
                                </div>
                            </td>
                        </tr>
            `
        }
        else{
            return `
            <tr>
                            <td>${order.maHD}</td>
                            <td>${order.userBill.username}</td>
                            <td>${order.ngayLap}</td>
                            <td>${order.trangThai}</td>
                            <td>${order.tongTien}</td>
                            <td>${order.address}</td>
                            <td>${order.phoneContact}</td>
                            <td>
                            </td>
                        </tr>
            `
        }
    })

    renderBlock.innerHTML = html.join('');
}

function handleChangeStatusOrder(e){
    var maHD = e.target.parentNode.parentNode.parentNode.firstElementChild.textContent;
    const orderChangeAPI = "http://localhost:8080/order/handle/"+maHD;
    if(confirm("Xử lý đơn hàng này?") == true){
        var options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
            },
          };
          fetch(orderChangeAPI, options)
            .then(function(response){
                response.json();
            })
            .then(function(){
                getOrderList(renderOrderAdminPage);
            });
    }
}

function handleCancelOrder(e){
    var maHD = e.target.parentNode.parentNode.parentNode.firstElementChild.textContent;
    const orderCancelAPI = "http://localhost:8080/order/cancel/"+maHD;
    if(confirm("Hủy đơn hàng này?") == true){
        var options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
            },
          };
          fetch(orderCancelAPI, options)
            .then(function(response){
                response.json();
            })
            .then(function(){
                getOrderList(renderOrderAdminPage);
            });
    }
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