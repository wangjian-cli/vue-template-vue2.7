import req from './http';
import { Env } from '@/types/env.d';
import { TestReq, TestRes } from '@/types/api.d';

const prefixOptions: Record<Env, any> = {
  dev: {
    apigate: 'apigate-test.10jqka.com.cn'
  },
  test: {
    apigate: 'apigate-test.10jqka.com.cn'
  },
  release: {
    apigate: 'apigate.10jqka.com.cn'
  }
};
const prefix = prefixOptions[import.meta.env.VUE_APP_CURRENTMODE as Env];
export const reqTest = (params: TestReq): Promise<TestRes['data']> =>
  req.get(`${prefix.apigate}/xxx`, { ...params });
