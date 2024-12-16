import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  // 兜底路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
];

const createRouter = () => {
  const router: VueRouter = new VueRouter({
    routes
  });
  return router;
};

const router = createRouter();

export default router;
