"use strict";

axios.interceptors.request.use(
  function(config) {
    config.headers["id"] = window.sessionStorage["id"];
    config.headers["token"] = window.sessionStorage["token"];
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    window.sessionStorage["token"] = response.headers["token"];
    return response;
  },
  function(error) {
    if (error.response) {
      window.sessionStorage["token"] = error.response.headers["token"];
    }
    return Promise.reject(error);
  }
);

function CatchError(err) {
  let error = String(err);
  let title = "错误"
  if (err.response) {
    if (err.response.status == 425) title = "安全风险";
    error = err.response.data;
  } 
  swal(title, error, "error")
    .then(() => {
      if (window.sessionStorage["token"] == 'undefined') {
        if (window.location.pathname.indexOf("task") != -1) {
          window.location.href = "../../index.html";
        } else if (window.location.pathname.indexOf("index.html") == -1) {
          window.location.href = "./index.html";
        }
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

function QueryString(name) {
  var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
  if (result == null || result.length < 1) return "";
  return result[1];
}