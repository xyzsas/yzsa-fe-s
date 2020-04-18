"use strict";

const colors = {
  green: '#f6ffed',
  blue: '#e6f7ff',
  red: '#fff1f0'
};

let timer;

const app = new Vue({
  el: '#app',
  data: {
    name: SS["name"],
    id: SS["id"],
    tip: "加载中 ...",
    timestamp: Math.floor(new Date().getTime() / 1000),
    tasklist: []
  },
  mounted() {
    let callback = SS["callback"]
    if (callback) {
      SS.removeItem("callback");
      Jump(callback);
      return;
    }
    timer = setInterval(this.fresh, 1000);
    axios
      .get("/api/U/task")
      .then(resp => {
        this.tasklist = resp.data;
        this.tip = "任务会自动开放，请勿反复刷新";
        this.fresh();
      })
      .catch(CatchError);
  },
  beforeDestroy() {
    clearInterval(timer);
  },
  methods: {
    fresh: function() {
      if (!this.tasklist) {
        this.tasklist = [];
        return;
      }
      let t = Math.floor(new Date().getTime() / 1000);
      this.tasklist.sort((a, b) => {
        let alpha = 1; let beta = 1; // default open
        if (a.end < t) alpha = -1; // ended
        if (a.start > t) alpha = 0; // not yet open
        if (b.end < t) beta = -1;
        if (b.start > t) beta = 0;
        return beta - alpha;
      });
      this.timestamp = t;
    },
    logout: function() {
      axios
        .delete("/api/C/auth")
        .then(() => {
          SS.removeItem("id");
          SS.removeItem("token");
          Jump('./index.html');
        })
        .catch(CatchError);
    },
    taskStyle: function(task) {
      if (task.end < this.timestamp) return "";
      if (task.start > this.timestamp) return `background: ${colors.blue};`;
      return `background: ${colors.green};`;
    },
    taskTitle: function(task) {
      let suffix = "";
      if (task.end < this.timestamp) suffix = " (已结束)";
      if (task.start > this.timestamp) suffix = " (未开始)";
      return task.title + suffix;
    },
    doTask: function(task) {
      if (task.end < this.timestamp || task.start > this.timestamp) return;
      window.location.href = `./task/${task.type}?id=${task.id}&title=${task.title}`;
    },
    changePwd: function() {
      Jump('./changePwd.html')
    }
  }
})