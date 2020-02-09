'use strict';

const colors = {
  blue: '#e6f7ff',
  grey: '#f0f2f5'
};

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: QueryString("title"),
    courses: {},
    done: false,
    loading: true
  },
  mounted: async function() {
    this.id = QueryString("id");
    if (!TaskCheck(this.id)) return;
    await axios // look for record
      .get(`/api/U/record/${this.id}`)
      .then(resp => {
        this.done = true;
        this.courses = {};
        this.courses[resp.data[SS["id"]].course] = "已选择";
      })
      .catch(err => { return; });
    if (this.done) {
      this.loading = false;
      return;
    }
    await axios // pull task data
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.courses = resp.data;
      })
      .catch(() => {
        CatchError();
        Jump("../../home.html");
      });
    this.loading = false;
  },
  methods: {
    enroll: async function(c) {
      if (this.courses[c] == "0" || this.done) return;
      this.loading = true;
      await axios
        .post(`/api/U/record/${this.id}`, { data: { course: c } })
        .then(resp => {
          swal("成功", "选课成功", "success")
            .then(() => {
              this.done = true;
              this.courses = {};
              this.courses[c] = "已选择";
            });
        })
        .catch(CatchError);
      this.loading = false;
    },
    courseStyle(c) {
      if (this.courses[c] == "0" || this.done) return "";
      else return `background: ${colors.blue};`;
    },
    back: function() {
      Jump("../../home.html");
    }
  }
})
