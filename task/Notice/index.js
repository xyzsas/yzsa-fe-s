var timer;

const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: QueryString("title"),
    content: '',
    timeLeft: 666666,
    readTime: 0,
    done: false,
    loading: true
  },
  mounted: async function() {
    this.id = QueryString("id");
    if (!TaskCheck(this.id)) return;
    await axios // look for record
      .get(`/api/U/record/${this.id}`)
      .then(resp => { this.done = true; })
      .catch(err => { return; });
    await axios // pull task data
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.content = resp.data.content;
        this.readTime = resp.data.readTime;
        if (!this.done) this.startCountDown();
      })
      .catch(() => {
        CatchError();
        Jump("../../home.html");
      });
    this.loading = false;
  },
  beforeDestroy() {
    clearInterval(timer);
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
          swal("成功", "回执提交成功", "success")
            .then(() => { this.done = true; });
        })
        .catch(CatchError);
      this.loading = false;
    },
    startCountDown: function() {
      if (!this.readTime) this.readTime = Math.floor(this.content.length / 10) + 10;
      this.timeLeft = this.readTime;
      timer = setInterval(this.countDown, 1000);
    },
    countDown: function() {
      this.timeLeft--;
      if (this.timeLeft <= 0) clearInterval(timer);
    }
  }
})