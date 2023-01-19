import req from './http';
import config from '@/config/index';
export const reqSmrz = (params: any) => req.get(config.api, { ...params });
