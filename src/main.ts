import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/style/reset.css';
import '@/assets/style/theme/dark.css';
import '@/assets/style/theme/light.css';
import '@atom/b2c-tokens/dist/variables.css';
import { defaultCover, tolerant, clickOutside } from '@/directives/index';

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
