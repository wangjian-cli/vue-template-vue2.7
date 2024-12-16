import req from './http';
import { Env } from '@/types/env.d';
import { TestReq, TestRes } from '@/types/api.d';

const DOMAIN = window?.Acme?.getDomain?.() || '10jqk.com.cn';

const prefixOptions: Record<Env, any> = {
  dev: {
    apigate: `apigate-test.${DOMAIN}`
  },
  test: {
    apigate: `apigate-test.${DOMAIN}`
  },
  release: {
    apigate: `apigate.${DOMAIN}`
  }
};
const prefix = prefixOptions[import.meta.env.VUE_APP_CURRENTMODE as Env];
export const reqTest = (params: TestReq): Promise<TestRes['data']> =>
  req.get(`${prefix.apigate}/xxx`, { ...params });
