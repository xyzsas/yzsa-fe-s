"use strict";

const colors = {
  green: '#f6ffed',
  blue: '#e6f7ff',
  red: '#fff1f0'
};

const app = new Vue({
  el: '#app',
  data: {
    name: window.localStorage["name"],
    sn: window.localStorage["sn"],
    timestamp: 0,
    tasklist: []
  },
  mounted() {
    setInterval(() => {
      this.timestamp = Math.floor(new Date().getTime() / 1000);
    }, 1000);
    axios
      .get("/api/S/task")
      .then(resp => {
        this.tasklist = resp.data;
      })
      .catch(CatchError);
  },
  methods: {
    logout: function() {
      axios
        .delete("/api/C/student/auth")
        .then(resp => {
          window.location.href = "./index.html";
        })
        .catch(CatchError);
    },
    taskStyle: function(task) {
      if (task.finish < this.timestamp) return "";
      if (task.start > this.timestamp) return `background: ${colors.blue};`;
      return `background: ${colors.green};`;
    },
    doTask: function(task) {
      if (task.finish < this.timestamp || task.start > this.timestamp) return;
      window.location.href = `./task/${task.type}/index.html?id=${task.id}`;
    }
  }
})