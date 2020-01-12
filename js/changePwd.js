"use strict";

const app = new Vue({
  el: '#app',
  data: {
    loading: true,
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  methods: {
    confirm: async function() {
      if (!this.oldPwd) {
        swal("请输入原密码！", "", "error");
        return ;
      } else if (!this.newPwd) {
        swal("请输入新密码！", "", "error");
        return ;
      } else if (!this.confirmPwd) {
        swal("请确认密码！", "", "error");
        return ;
      } else if (this.confirmPwd !== this.newPwd) {
        swal("确认密码与密码不符！", "", "error");
        return ;
      } else if (this.newPwd === this.oldPwd) {
        swal("新密码不得与原密码相同", "", "error")
        return ;
      }
      this.loading = true;
      // change pwd 
      await axios
        .put("/api/U/pwd", {
          oldPwd: this.oldPwd,
          newPwd: this.newPwd
        })
        .then(resp => {
          if (resp.status === 200) {
            swal(resp.data, "修改密码成功，请重新登录。", "success")
            .then(()=>{ window.location.href = "./index.html"; })
          } 
        })
        .catch(err => {
          this.oldPwd = this.newPwd = this.confirmPwd = "";
          swal("原密码不正确！", "", "error");
        });
      this.loading = false;
    }
  }
})