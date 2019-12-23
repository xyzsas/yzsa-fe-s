"use strict";

axios.defaults.baseURL = "http://172.17.61.212:5000/";

axios.interceptors.request.use(
  function(config) {
    config.headers["id"] = window.sessionStorage["studentId"];
    config.headers["token"] = window.sessionStorage["studentToken"];
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    console.log(response.headers);
    window.sessionStorage["studentToken"] = response.headers["token"];
    return response;
  },
  function(error) {
    if (error.response) {
      window.sessionStorage["studentToken"] = error.response.headers["token"];
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
  swal(title, error, "error");
}

function HASH(msg, salt) {
  var sha256 = new Hashes.SHA256().hex(msg + salt);
  var md5 = new Hashes.MD5().hex(sha256 + salt);
  return md5;
}

function Sleep(ms){
  return new Promise((resolve) => setTimeout(resolve, ms));
}