function goback() {
  window.location.href = "../../home.html";
}

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: window.sessionStorage["task"],
    lessons: [],
    loading: true,
  },
  mounted() {
    this.id = QueryString("id");
    if (!this.id) {
      swal('跑错啦！', '网页地址错误', "error")
        .then(goback)
    }
    axios
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.lessons = Object.keys(resp.data).map(i => [i, resp.data[i]]);
        this.lessons.unshift(['课程名称', '剩余人数']);
        this.loading = false;
      })
      .catch((error) => {
        swal("错误", error.response.data, "error")
          .then(goback);
      });
  },
  methods: {
    enroll: function(item) {
      axios.post(`/api/U/record/${this.id}`,{
         "data": {
          "course": item[0]
        }
      })
        .then(resp => {
          swal("成功", "选课成功", "success")
        })
        .catch(err => {
          console.log(err.response)
          swal("错误", err.response.data, "error")
        })
    },
    back: function() {
      goback();
    }
  }
})