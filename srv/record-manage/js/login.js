document.getElementById("loginButton").addEventListener("click", verifyLogin);
document.getElementById('username').addEventListener('keypress', loginOrNot);
document.getElementById('password').addEventListener('keypress', loginOrNot);

function loginOrNot(event) {
    if (event.keyCode == 13) {
        verifyLogin();
    }
}

function verifyLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var login = {
        username: username,
        password: password
    }
    $.ajax({
        method: 'POST',
        // url: 'https://withcic.cn/apps/upload/index.php?login',
        // url: 'http://192.168.1.106/record/index.php?login',
        url: '/login.php',
        data: login,
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success: function (result) {
			//原来为1则进入管理页，Jefung改为0
            if (result.status == 0) {
                window.location.href = './manage.html';
            } else {
                Materialize.toast(result.message, 4000);
            }
        },
        error: (error) => {
            Materialize.toast(error.responseText, 4000);
        }
    })
}
