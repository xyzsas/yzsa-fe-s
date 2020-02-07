const colors = {
  blue: '#e6f7ff',
  grey: '#aaa',
};

const app = new Vue({
  el: '#app',
  data: {
    id: '',
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
        this.loading = false;
      })
      .catch((error) => {
        swal("错误", error.response.data, "error")
          .then(Jump("../../home.html"));
      });
  },
  methods: {
    enroll: function(item) {
      if (item[1] === '0') return;
      axios.post(`/api/U/record/${this.id}`,{
         "data": {
          "course": item[0]
        }
      })
        .then(resp => {
          swal("成功", "选课成功", "success")
        })
        .catch(err => {
          swal("错误", err.response.data, "error")
        })
    },
    courseStyle(course) {
      if (course[1] === '0') return `background: ${colors.grey}; pointer-events: none; `;
      return `background: ${colors.blue};`;
    },
    back: function() {
      Jump("../../home.html");
    }
  }
})