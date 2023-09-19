const accountListAPI = "http://localhost:8080/user/list";
const customerListAPI = "http://localhost:8080/user/customer";

function accountManageStart(){
    getAccountList(renderAccountManagePage);
}

accountManageStart();
function getAccountList(callback){
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
        },
    };

    fetch(accountListAPI,options)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function renderAccountManagePage(accounts){
    var renderBlock = document.querySelector(".product-table__item");
    var html = accounts.map(function(account){
        return `
        <tr id="${account.username}">
                        <td>${account.username}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div class="product-table__control">
                                <button class="admin-btn order-status-change admin-btn--disable">
                                    Khóa tài khoản
                                </button>
                                <div class="control-seperate">|</div>
                                <button href="" class="admin-btn order-status-cancel">
                                    Xóa tài khoản
                                </button>

                            </div>
                        </td>
                    </tr>
    `
    })
    renderBlock.innerHTML = html.join('');
    getCustomer(renderCustomer);
}

// function renderCustomer(customer){
//     var renderBlock = document.querySelector("tr#"+customer.user.username);
//     var html = `
//     <tr>
//                         <td>${customer.user.username}</td>
//                         <td>${customer.tenKH}</td>
//                         <td>${customer.email}</td>
//                         <td>${customer.phone}</td>
//                         <td>
//                             <div class="product-table__control">
//                                 <button class="admin-btn order-status-change admin-btn--disable">
//                                     Khóa tài khoản
//                                 </button>
//                                 <div class="control-seperate">|</div>
//                                 <button href="" class="admin-btn order-status-cancel">
//                                     Xóa tài khoản
//                                 </button>

//                             </div>
//                         </td>
//                     </tr>
//     `
//     renderBlock.innerHTML = html.join('');

// }

// function checkCustomer(account){
//     var customerAPI = "http://localhost:8080/user/customer/"+account;
//     var options = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
//         },
//     };
//         fetch(customerAPI,options)
//         .then(function(response){
//             if(response.ok){
//                 return true;
//             }
//             else if(response.status === 404){
//                 return false;
//             }
//             else{
//                 return Promise.reject('Something went wrong: ' + response.status)
//             }
//         })
//         .then(callback)
//         .catch(function(error){
//             console.log(error);
//             return false;
//           });
// }

function getCustomer(callback){
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie("accessTokenAdmin"),
        },
    };
        fetch(customerListAPI,options)
        .then(function(response){
                return response.json();
        })
        .then(callback);
}

function renderCustomer(customer){
    var renderBlock = document.querySelectorAll("tr");
    customer.forEach(element => {
        for(var j=0;j<renderBlock.length;j++){
            if(renderBlock[j].id == element.user.username){
                renderBlock[j].innerHTML = `
                <td>${element.user.username}</td>
                        <td>${element.tenKH}</td>
                        <td>${element.email}</td>
                        <td>${element.phone}</td>
                        <td>
                            <div class="product-table__control">
                                <button class="admin-btn order-status-change admin-btn--disable">
                                    Khóa tài khoản
                                </button>
                                <div class="control-seperate">|</div>
                                <button href="" class="admin-btn order-status-cancel">
                                    Xóa tài khoản
                                </button>

                            </div>
                        </td>
                `
            }
        }
    });
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