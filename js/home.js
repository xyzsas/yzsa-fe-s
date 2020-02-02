"use strict";

const colors = {
  green: '#f6ffed',
  blue: '#e6f7ff',
  red: '#fff1f0',
  grey: '#e8e8e8'
};

const app = new Vue({
  el: '#app',
  data: {
    name: window.sessionStorage["name"],
    id: window.sessionStorage["id"],
    timestamp: 0,
    tasklist: []
  },
  mounted() {
    setInterval(() => {
      this.timestamp = Math.floor(new Date().getTime() / 1000);
    }, 1000);
    axios
      .get("/api/U/task")
      .then(resp => {
        this.tasklist = resp.data;
      })
      .catch(CatchError);
  },
  methods: {
    logout: function() {
      axios
        .delete("/api/C/auth")
        .then(Jump('./index.html'))
        .catch(CatchError);
    },
    taskStyle: function(task) {
      if (task.finish < this.timestamp) return "";
      if (task.start > this.timestamp) return `background: ${colors.blue};`;
      if (task.start == 0 && task.end == 0) return `background: ${colors.grey}`;
      return `background: ${colors.green};`;
    },
    doTask: function(task) {
      if (task.finish < this.timestamp || task.start > this.timestamp) return;
      window.location.href = `./task/${task.type}?id=${task.id}`;
    },
    changePwd: function() {
      Jump('./changePwd.html')
    }
  }
})