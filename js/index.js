"use strict";

const SALT = "Supported_by_ITI";

const app = new Vue({
  el: '#app',
  data: {
    step: 'username',
    loading: true,
    username: '',
    password: '',
    random: ''
  },
  mounted: function() {
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
          let SS = window.sessionStorage;
          SS["name"] = resp.data.name;
          SS["sn"] = resp.data.sn;
          SS["studentId"] = resp.data.id;
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