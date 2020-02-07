'use strict';

const colors = {
  blue: '#e6f7ff',
  grey: 'rgba(0, 0, 0, 0.65)'
};

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: window.sessionStorage["task"],
    courses: {},
    loading: true
  },
  mounted() {
    this.id = QueryString("id");
    if (!this.id) {
      swal('跑错啦！', '网页地址错误', "error")
        .then(() => { Jump("../../home.html"); });
      return;
    }
    axios
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.courses = resp.data;
        this.loading = false;
      })
      .catch(CatchError);
  },
  methods: {
    enroll: async function(c) {
      if (this.courses[c] == "0") return;
      this.loading = true;
      await axios
        .post(`/api/U/record/${this.id}`, { course: c })
        .then(resp => {
          swal("成功", "选课成功", "success")
            .then(this.back);
        })
        .catch(CatchError);
      this.loading = false;
    },
    courseStyle(c) {
      if (this.courses[c] != "0") return `background: ${colors.blue};`;
      else return "";
    },
    back: function() {
      Jump("../../home.html");
    }
  }
})