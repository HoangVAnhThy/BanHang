const loginAPI = 'http://localhost:8080/login';


function handleLogin(){
    var username = document.querySelector('input[name="usernameLogin"]').value;
    var password = document.querySelector('input[name="passwordLogin"]').value;
    var formDataLogin = {
      username: username,
      password: password
    }
    login(formDataLogin,loginAPI);
  }
  
  
  function login(data,api){
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      redirect: 'follow'
    };
  
    fetch(api, options)
      .then(function(response){
        if(response.ok){
          return response.json();
        }
      })
      .then(function(result){
        setCookie("accessTokenAdmin",result.accessToken, 3);
        alert("Đăng nhập thành công");
        window.location.assign("http://127.0.0.1:5500/admin.html");
      })
      .catch(function(){
        alert("Username hoặc password sai");
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
  
  //Lấy payload token
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }