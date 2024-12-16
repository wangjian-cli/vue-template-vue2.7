import Vue from 'vue';
import VueRouter from 'vue-router';
import { getOS, setTitle, androidCanBackProtocol } from '@/utils/tools';
import { Os } from '@/types/tools.d';
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
    routes,
    scrollBehavior(to: any, from: any, savedPosition: any) {
      return (
        savedPosition || {
          x: 0,
          y: 0
        }
      );
    }
  });
  // 安全版本
  const securityVersion = 5;
  router.beforeEach((to: { meta: { title: string } }, _from: any, next: () => void) => {
    if (
      getOS().sys === Os.iphone ||
      (getOS().sys === Os.gphone &&
        getOS().version &&
        +(getOS().version as string).split('.')[0] >= securityVersion)
    ) {
      to.meta?.title && setTitle(to.meta.title);
    }
    androidCanBackProtocol();
    next();
  });
  return router;
};

const router = createRouter();

export default router;
