"use strict";

const olors = {
  green: '#f6ffed',
  blue: '#e6f7ff',
  red: '#fff1f0',
}

const app = new Vue({
  el: '#app',
  data: {
    name: '(Name)',
    sn: '(StudentNumber)',
    tasklist: [{
      title: "这是一个测试，可能会很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
      time: "2019.9.9 00:00:00 - 2018.8.8 00:00:00"
    },
    {
      title: "测试",
      time: "2019.9.9 00:00:00 - 2018.8.8 00:00:00"
    },
    {
      title: "这是一个测试，可能会很长",
      time: "2019.9.9 00:00:00 - 2018.8.8 00:00:00"
    },
    {
      title: "2019级拓展性课程选课",
      time: "2019.9.9 00:00:00 - 2018.8.8 00:00:00"
    }],
  },
  mounted() {
    this.name = window.localStorage["name"];
    this.sn = window.localStorage["sn"];
  },

})