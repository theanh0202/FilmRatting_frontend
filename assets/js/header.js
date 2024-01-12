"use strict";
let isManager = true;

$(function () {
    checkLogin();
});

function checkLogin(){
    let fullName = localStorage.getItem("fullName");
    let avatar = localStorage.getItem("avatar");

    let textNoLogin = '<a href="./login.html">'
    + '<button class="btn btn-primary">Sign in</button>'
    + '</a>'

    let textUserLogin = '<li class="header__navbar-item header__navbar-user">'
    + '<img src="'+ avatar + '" alt="" class="header__navbar-user-img" />'
    + '<span class="header__navbar-user-name">'+ fullName + '</span>'
    + '<ul class="header__navbar-user-menu"><li class="header__navbar-user-item">'
    + '<a href="">My Account</a></li><li class="header__navbar-user-item">'
    + '<a href="#" onclick="navToReviewHistory()">Review History</a></li><li class="header__navbar-user-item">'
    + '<a href="" onclick="logout()">Log Out</a></li> </ul></li>'

    let textAdminLogin = '<li class="header__navbar-item header__navbar-user">'
    + '<img src="'+ avatar + '" alt="" class="header__navbar-user-img" />'
    + '<span class="header__navbar-user-name">'+ fullName + '</span>'
    + '<ul class="header__navbar-user-menu"><li class="header__navbar-user-item">'
    + '<a href="">My Account</a></li><li class="header__navbar-user-item">'
    + '<a href="">Account Management</a></li><li class="header__navbar-user-item">'
    + '<a href="">Review Management</a></li><li class="header__navbar-user-item">'
    + '<a href="" onclick="logout()">Log Out</a></li> </ul></li>'

    if(localStorage.getItem("token") === null){
     console.log("chưa đăng nhập")
     document.getElementById("user-login").innerHTML = textNoLogin;
    } else {
     console.log("Đã đăng nhập");
     if ("ADMIN" === localStorage.getItem("role")) {
        document.getElementById("user-login").innerHTML = textAdminLogin;
     } else {
        document.getElementById("user-login").innerHTML = textUserLogin;
     }
    //  document.getElementById("user-login").innerHTML = textUserLogin;
    }
 }

 function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("avatar");
    window.location.href = "/";
 }