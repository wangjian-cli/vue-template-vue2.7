import { Env, Result } from '@/types/configType';
const host: string = '';
// 环境域名
const envHost: Record<Env, string> = {
  // 对应proxy
  dev: host,
  //对应测试环境主域名
  test: host,
  //对应正式环境主域名
  release: host
};
const BASE_URL_API = envHost[import.meta.env.VUE_APP_CURRENTMODE as Env];

// 相同域名接口申明(自动拼接域名前缀)
const interfaceApi: Record<string, any> = {};
Object.keys(interfaceApi).forEach(key => (interfaceApi[key] = BASE_URL_API + interfaceApi[key]));

const diffHostInterfaceObj = {};
// 不同域名接口申明
const diffHostInterface: Record<Env, any> = {
  //对应开发环境主域名
  dev: {},
  //对应测试环境主域名
  test: {},
  //对应正式环境主域名
  release: {}
};
const result: Result = {
  stat: {
    pageId: '',
    // eslint-disable-next-line camelcase
    url_ver: ''
  },
  api: {
    ...interfaceApi,
    // 其余域名自行填充
    ...diffHostInterface[import.meta.env.VUE_APP_CURRENTMODE as Env]
  },

  url: {
    // 实名认证页
  }
};
export default result;
