"use strict";

const colors = {
  green: '#f6ffed',
  blue: '#e6f7ff',
  red: '#fff1f0'
};

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
    setInterval(this.fresh, 1000);
    axios
      .get("/api/U/task")
      .then(resp => {
        this.tasklist = resp.data;
        this.tip = "任务会自动开放，请勿反复刷新";
        this.fresh();
      })
      .catch(CatchError);
  },
  methods: {
    fresh: function() {
      let t = Math.floor(new Date().getTime() / 1000);
      this.tasklist.sort((a, b) => {
        return Math.abs(a.start - t) - Math.abs(b.start - t); 
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
    doTask: function(task) {
      if (task.end < this.timestamp || task.start > this.timestamp) return;
      window.location.href = `./task/${task.type}?id=${task.id}&title=${task.title}`;
    },
    changePwd: function() {
      Jump('./changePwd.html')
    }
  }
})