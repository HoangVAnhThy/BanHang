
const productAPI = 'http://localhost:8080/product';

function handleCreateForm() {
    var maMH = document.querySelector('input[name="maMH"]').value;
    var tenMH = document.querySelector('input[name="tenMH"]').value;
    var maLoai = document.querySelector('input[name="maLoai"]').value;
    var moTa = document.querySelector('input[name="moTa"]').value;
    var soLuong = document.querySelector('input[name="soLuong"]').value;

    var formData = {
        maMH: maMH,
        tenMH: tenMH,
        maLoai: maLoai,
        moTa: moTa,
        soLuong: soLuong
    }

    createProduct(formData)
}

function createProduct(data) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(productAPI, options)
        .then(function (response) {
            response.json();
        })
}

var fileInput = document.getElementById('imageUploadInput');
var fileInputBtn = document.getElementById('imageUploadInputBtn');
var imagePreview = document.getElementById('imagePreview');
var statusImg = document.getElementById('uploadFileStatus');
var sendBtn = document.getElementById('sendData');
var infoName = document.getElementById('fileInfomation_name');
var infoType = document.getElementById('fileInfomation_type');
var infoSize = document.getElementById('fileInfomation_size');
var imageData = "";
var fileTypes = ['image/png', 'image/jpeg'];
var maxSize = 30 * 1024 * 1024; // 30MB

function onChangeInput(event){
    statusImg.innerHTML = '';
    imagePreview.setAttribute('src', "img/default.jpg");
    imageData = '';
    let file = event.target.files[0];
    infoName.innerHTML = file.name;
    infoType.innerHTML = file.type;
    infoSize.innerHTML = file.size + " bytes";
    if (fileTypes.indexOf(file.type) == -1) {
        statusImg.innerHTML = "File không hợp lệ (chỉ file hình jpg và hình png)";
    }
    if (file.size > maxSize) {
        statusImg.innerHTML = "Dung lượng file vượt quá giới hạn (tối đa 30MB)";
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        imageData = e.target.result;

        // Validate file content
        imagePreview.onerror = function () {
            imageData = "";
            imagePreview.setAttribute('src', "img/default.jpg");
            statusImg.innerHTML = 'Nội dung hình không hợp lệ';
        };
        imagePreview.setAttribute('src', self.imageData);
    };
    reader.readAsDataURL(file);
}

function fileInputClick(){
    fileInput.click()
}

