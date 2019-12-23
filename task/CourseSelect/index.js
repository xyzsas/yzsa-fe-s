const app = new Vue({
  el: '#app',
  mounted() {
    axios
      .get("/api/S/task/CourseSelect/24rc7573py4h/info")
      .then(resp => {
        console.log(resp.data);
      })
      .catch(CatchError);
  }
})