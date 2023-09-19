const saveCustomerAPI = "http://localhost:8080/user/info";

function start(){
    getCustomer(renderInfo);
}

start();
function renderInfo(customer){
    var tenKHInput = document.querySelector('.user-information__form-content input[name="tenKH"]');
    var emailInput = document.querySelector('.user-information__form-content input[name="email"]');
    var phoneInput = document.querySelector('.user-information__form-content input[name="phone"]');
    tenKHInput.value = customer.tenKH;
    emailInput.value = customer.email;
    phoneInput.value = customer.phone;
}

function getCustomer(callback){
    var payload = parseJwt(getCookie("accessToken"));
    var username = document.querySelector(".user-information_username");
    username.innerText = payload.sub;
    var customerAPI = "http://localhost:8080/customer/" + payload.sub;
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie("accessToken")
        }
    };
    fetch(customerAPI, options)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            return Promise.reject('Something went wrong: ' + response.status)
        }
    })
    .then(callback)
    .catch(function(error){
        console.log(error);
    })
}



function handleSaveInfo() {
    var tenKH = document.querySelector('.user-information__form-content input[name="tenKH"]').value;
    var email = document.querySelector('.user-information__form-content input[name="email"]').value;
    var phone = document.querySelector('.user-information__form-content input[name="phone"]').value;
    var formData = {};
    getUser(function (user) {
        formData = {
            user: user,
            tenKH: tenKH,
            email: email,
            phone: phone
        }
        saveInfo(formData);
    })
}

function saveInfo(data) {
    var payload = parseJwt(getCookie("accessToken"));
    var customerAPI = "http://localhost:8080/customer/" + payload.sub;
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie("accessToken")
        }
    };
    fetch(customerAPI, options)
        .then(function (response) {
            if (response.ok) {
                var options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getCookie("accessToken")
                    },
                    body: JSON.stringify(data)

                };
                fetch(saveCustomerAPI, options)
                    .then(function (response) {
                        response.json();
                    })
                alert("Lưu thành công");
            }
            else if (response.status === 404) {
                console.log(data);
                var options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getCookie("accessToken")
                    },
                    body: JSON.stringify(data)
                };
                fetch(saveCustomerAPI, options)
                    .then(function (response) {
                        response.json();
                    })
                    alert("Lưu thành công");
            }
            else {
                return Promise.reject('Something went wrong: ' + response.status)
            }
        })
        .catch(function (error) {
            console.log(error);
        })

}