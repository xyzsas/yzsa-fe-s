const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: window.sessionStorage["task"],
    content: '',
    style: 'display: block; pointer-events: none; background: #aaa; border: none;',
    tip: '请仔细阅读 ',
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
        this.loading = false;
      })
      .catch(CatchError);
  },
  methods: {
    back: function() {
      Jump("../../home.html");
    },
    read: async function() {
      this.loading = true;
      await axios
        .post(`/api/U/record/${this.id}`)
        .then(resp => {
          swal("成功", "回执提交成功", "success");
        })
        .catch(CatchError);
      this.loading = false;
    },
    countDown: function() {
      let interval = Math.floor(this.content.length / 10) + 1;
        this.tip += interval.toString() + 's'
        while (interval >= 0) {
          this.tip = '请仔细阅读 ' + interval.toString() + 's'
          interval--;
          await sleep(1000);
        }
        this.tip = '已阅读';
        this.style = "display: ''; background: #1890ff;"
    }
  }
})