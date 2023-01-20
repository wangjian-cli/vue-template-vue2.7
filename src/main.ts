import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/style/reset.css';

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
