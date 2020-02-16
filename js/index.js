"use strict";

const SALT = "Supported_by_ITI";

const app = new Vue({
  el: '#app',
  data: {
    step: 'username',
    loading: true,
    input: '',
    username: '',
    random: ''
  },
  mounted: async function() {
    await Sleep(500);
    this.loading = false;
    await Sleep(1000);
    this.$refs.input.focus();
  },
  computed: {
    tips: function() {
      switch (this.step) {
        case 'username': return {
          step: '登录',
          inputType: 'text',
          placeholder: '用户名/证件号',
          button: '下一步'
        }
        case 'password': return {
          step: '输入密码',
          inputType: 'password',
          placeholder: '密码',
          button: '登录'
        }
      }
    }
  },
  methods: {
    act: async function() {
      if (this.loading) return;
      if (!this.input) return;
      this.loading = true;
      switch (this.step) {
        case 'username': {
          this.username = this.input;
          await axios
            .get("/api/C/auth?id=" + this.username)
            .then(resp => {
              this.random = resp.data;
              this.step = "password";
            })
            .catch(CatchError);
          break;
        }
        case 'password': {
          this.step = 'username';
          await axios
            .post("/api/C/auth", {
              id: this.username,
              token: this.random,
              password: HASH(HASH(this.input, SALT), this.random)
            })
            .then(resp => {
              SS["id"] = resp.data.id;
              SS["name"] = resp.data.name;
              SS["role"] = resp.data.role;
              if (SS["role"] == "admin" || SS["role"] == "teacher") {
                swal("学生事务系统", "是否前往管理页面？", "info", {
                  buttons: ["进入一般用户界面", true]
                }).then(value => {
                    if (value) Jump("/admin/");
                    else Jump("./home.html");
                  })
              } else Jump("./home.html");
            })
            .catch(CatchError);
          break;
        }
      }
      this.input = '';
      this.loading = false;
      await Sleep(600);
      if (this.step === 'password') this.$refs.input.focus();
    }
  }
})