const app = new Vue({
  el: '#app',
  data: {
    id: '',
    title: QueryString("title"),
    form: {},
    indexes: [],
    I: 0,
    q: {},
    text: "",
    chosen: {},
    response: {},
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
    if (this.done) {
      this.indexes[0] = "您已完成此问卷";
      this.loading = false;
      return;
    }
    await axios // pull task data
      .get(`/api/U/task/${this.id}`)
      .then(resp => {
        this.form = resp.data;
        for (key in this.form) {
          this.indexes.push(key);
        }
        this.q = this.form[this.indexes[this.I]];
      })
      .catch(err => {
        CatchError(err);
        Jump("../../home.html");
      });
    this.loading = false;
  },
  computed: {
    tip: function() {
      if (this.I < this.indexes.length-1) return "下一题";
      else return "提交";
    },
  },
  methods: {
    back: function() {
      Jump("../../home.html");
    },
    next: function() {
      if (!this.check()) return;
      if (this.I < this.indexes.length-1) this.I++;
      else {
        this.submit();
        return;
      }
      this.text = "";
      this.chosen = {};
      this.q = this.form[this.indexes[this.I]];
    },
    choose: function(key) {
      this.chosen[key] = !this.chosen[key];
      this.$forceUpdate();
    },
    check: function() {
      switch (this.q.type) {
        case 'choose': {
          let resp = [];
          for (k in this.chosen) {
            if (this.chosen[k]) resp.push(k);
          }
          if (resp.length > this.q.max || resp.length < this.q.min) {
            swal("错误", "答案个数错误", "error");
            return false;
          }
          this.response[this.indexes[this.I]] = resp;
          return true;
        }
        case 'fill': {
          if (this.text.length == 0) {
            swal("错误", "请填写内容", "error");
            return false;
          }
          if (this.text.length > this.q.max) {
            swal("错误", "内容太长！", "error");
            return false;
          }
          this.response[this.indexes[this.I]] = this.text;
          return true;
        }
        default: {
          return false;
        }
      }
    },
    submit: async function() {
      let confirm = await swal("确认提交？", "提交以后不能修改", "info", {
        buttons: ["取消", true]
      });
      if (!confirm) return;
      this.loading = true;
      await axios
        .post(`/api/U/record/${this.id}`, { data: this.response })
        .then(resp => {
          swal("成功", "问卷提交成功", "success")
            .then(this.back);
        })
        .catch(CatchError);
      this.loading = false;
    }
  }
})