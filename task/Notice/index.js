function goback() {
  window.location.href = "../../home.html";
}

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: window.sessionStorage["task"],
    content: '',
    style: 'display: block; pointer-events: none; background: #e8e8e8;'
  },
  mounted() {
    this.id = QueryString("id");
    console.log(this.title)
    if (!this.id) {
      swal('跑错啦！', '网页地址错误', "error")
        .then(goback)
    }
    axios
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.content = resp.data.content;
        setTimeout( () => {this.style = "display: ''; pointer-events: auto;"}, (Math.floor(this.content.length / 10) + 1) * 1000);
      })
      .catch((error) => {
        swal("错误", error.response.data, "error")
          .then(goback);
      });
  },
  methods: {
    back: function() {
      goback();
    },
    read: function() {
      axios
        .post(`/api/U/record/${this.id}`)
        .then(resp => {
          swal("成功", "阅读完成", "success");
        })
        .catch((error) => {
          swal("错误", error.response.data, "error")
        });
    }
  }
})