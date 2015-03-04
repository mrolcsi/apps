/**
 * Created by Roland on 2015.03.04..
 */

var appId = "bsik2f";

function sendData() {
    var owner = document.getElementById("owner").value;
    var data = document.getElementById("data").value;

    var oReq = new XMLHttpRequest();
    oReq.onload = onRequestLoad;

    oReq.open("post", "http://k-firefoxos.appspot.com/objects", true);
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.send("appid=" + appId + "&owner=" + owner + "&text=" + data);
}

function onRequestLoad() {
    console.log(this.responseText);
}

function getData() {
    var owner = document.getElementById("owner").value;

    var oReq = new XMLHttpRequest();
    oReq.onload = showData;

    oReq.open("get", "http://k-firefoxos.appspot.com/objects?appid=" + appId + "&owner=" + owner);

    oReq.send();
}

function showData() {
    document.getElementById("dataList").innerHTML = "";

    //string futtatása mint javascript
    //(nem szükséges)
    eval("var ids=" + this.responseText + ";");

    for (var x = 0; x < ids.length; x++) {
        console.log(ids[x]);

        var oReq = new XMLHttpRequest();
        oReq.onload = viewData;
        oReq.open("get", "http://k-firefoxos.appspot.com/objects?appid=" + appId + "&id=" + ids[x]);
        oReq.send();
    }
}

function viewData() {
    var ul = document.getElementById("dataList");
    var li = document.createElement("li");
    li.innerHTML = this.responseText;
    ul.appendChild(li);
}