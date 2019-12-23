const app = new Vue({
  el: '#app',
  data: {
    id: ''
  },
  mounted() {
    this.id = QueryString("id");
    if (!this.id) {
      swal('跑错啦！', '网页地址错误', "error")
        .then(() => {
          window.location.href = "../../home.html";
        })
    }
    axios
      .get(`/api/S/task/CourseSelect/${this.id}/info`)
      .then(resp => {
        console.log(resp.data);
      })
      .catch(CatchError);
  }
})