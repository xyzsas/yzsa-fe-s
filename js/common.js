"use strict";

var SS = window.sessionStorage;

axios.interceptors.request.use(
  function(config) {
    config.headers["id"] = SS["id"];
    config.headers["token"] = SS["token"];
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(resp) {
    SS["token"] = resp.headers["token"];
    return resp;
  },
  function(err) {
    if (err.response) {
      SS["token"] = err.response.headers["token"];
    }
    return Promise.reject(err);
  }
);

function Jump(url) {
  window.location.href = url;
}

// universal error handle
function CatchError(err) {
  let error = String(err);
  let title = "错误"
  if (err && err.response) {
    if (err.response.status == 425) title = "安全风险";
    error = err.response.data;
  } 
  swal(title, error, "error")
    .then(() => {
      if (SS["token"] == 'undefined') {
        if (window.location.pathname.indexOf("task") != -1) {
          Jump("../../index.html");
        } else Jump("./index.html");
      }    
    });
}

function HASH(msg, salt) {
  var sha256 = new Hashes.SHA256().hex(msg + salt);
  var md5 = new Hashes.MD5().hex(sha256 + salt);
  return md5;
}

function Sleep(ms){
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// find query
function QueryString(name) {
  var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
  if (result == null || result.length < 1) return "";
  return result[1];
}

// check at task initialization
function TaskCheck(task) {
  if (!task) {
    swal('跑错啦!', '网页地址错误', "error")
      .then(() => { Jump("../../home.html"); });
    return false;
  }
  if (!SS["token"] || SS["token"] == "undefined") {
    swal('未登录', '请先前往登录！', "error")
      .then(() => {
        SS["callback"] = window.location.href;
        Jump("../../index.html");
      });
    return false;
  }
  return true;
}