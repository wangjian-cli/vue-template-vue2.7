import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/style/reset.css';
import '@/assets/style/theme/dark.css';
import '@/assets/style/theme/light.css';
import '@atom/b2c-tokens/dist/variables.css';

new Vue({
  render: (h: Vue.CreateElement) => h(App),
  router
}).$mount('#app');
