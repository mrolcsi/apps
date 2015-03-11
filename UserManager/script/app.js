var appId = "bsik2f";
var owner = "0c8e51ec-0305-4bd2-af31-9a96b15e7451";

function save() {
    var dataObject = '{"email":"' + $("#email").val() +
        '", "name":"' + $("#fullName").val() +
        '", "nick":"' + $("#nickName").val + '"}';

    var req = new XMLHttpRequest();

    req.onload = dataSaved;

    req.open("POST", "http://k-firefoxos.appspot.com/objects");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.send("appid=" + appId + "&owner=" + owner + "&text=" + dataObject);
}

function dataSaved() {
    var resultString = this.responseText;

    alert(resultString);
}