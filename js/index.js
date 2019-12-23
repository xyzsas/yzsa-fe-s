"use strict";

function sleep(ms){
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SALT = "Supported_by_yzITI_32496";

const app = new Vue({
  el: '#app',
  data: {
    step: 'username',
    loading: true,
    username: '',
    password: '',
    random: ''
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  methods: {
    next: async function() {
      if (!this.username) {
        swal("请输入用户名！", "", "error");
        return ;
      }
      this.loading = true;
      await axios
        .get("/api/C/student/auth?id=" + this.username)
        .then(resp => {
          this.random = resp.data;
          this.step = "password";
        })
        .catch(CatchError);
      this.loading = false;
    },
    login: async function() {
      if (!this.password) {
        swal("请输入密码！", "", "error");
        return ;
      }
      this.loading = true;
      await axios
        .post("/api/C/student/auth", {
          id: this.username,
          token: this.random,
          password: HASH(HASH(this.password, SALT), this.random)
        })
        .then(resp => {
          let LS = window.localStorage;
          LS["name"] = resp.data.name;
          LS["sn"] = resp.data.sn;
          window.location.href = "./home.html";
        })
        .catch(err => {
          CatchError(err);
          this.step = "username";
          this.password = "";
        });
      this.loading = false;
    }
  }
})