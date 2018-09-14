import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import meta from 'vue-meta'

Vue.use(meta);

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

window.vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')