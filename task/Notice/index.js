var timer;

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: window.sessionStorage["task"],
    content: '',
    timeLeft: 666666,
    loading: true
  },
  mounted() {
    this.id = QueryString("id");
    if (!this.id) {
      swal('跑错啦！', '网页地址错误', "error")
        .then(() => { Jump("../../home.html"); });
    }
    axios
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.content = resp.data.content;
        this.startCountDown();
        this.loading = false;
      })
      .catch(() => {
        CatchError();
        Jump("../../home.html");
      });
  },
  computed: {
    tip: function() {
      if (this.timeLeft <= 0) return "已阅读";
      else return `请仔细阅读 ${this.timeLeft}s`;
    },
    readStyle: function() {
      if (this.timeLeft > 0) return "";
      else return "background: #e6f7ff;";
    }
  },
  methods: {
    back: function() {
      Jump("../../home.html");
    },
    read: async function() {
      this.loading = true;
      await axios
        .post(`/api/U/record/${this.id}`)
        .then(() => {
          swal("成功", "回执提交成功", "success");
        })
        .catch(CatchError);
      this.loading = false;
    },
    startCountDown: function() {
      this.timeLeft = Math.floor(this.content.length / 10) + 10;
      timer = setInterval(this.countDown, 1000);
    },
    countDown: function() {
      this.timeLeft--;
      if (this.timeLeft <= 0) clearInterval(timer);
    }
  }
})