import index from "./page/index.js"

Vue.prototype.$http = cockpit.http({
  "address": "localhost",
  "port": 8000,
});

new Vue({
  el: '#app',
  components: {
      index,
    },
});