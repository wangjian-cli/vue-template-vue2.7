import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { defaultCover, tolerant, clickOutside } from '@/directives/index';
import '@/assets/style/reset.css';

const directives = {
  defaultCover,
  tolerant,
  clickOutside
};

Object.entries(directives).forEach(([name, directives]) => {
  Vue.directive(name, directives);
});

new Vue({
  render: (h: Vue.CreateElement) => h(App),
  router
}).$mount('#app');
