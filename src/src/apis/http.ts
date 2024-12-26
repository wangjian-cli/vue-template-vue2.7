import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axiosInstance, axiosWithCredentials } from './axios';
import { errorReport } from '@/utils/tools';
// get,post成功返回执行的函数
const successFn = (response: AxiosResponse<any>, resolve: (value: any) => void, params: any) => {
  const { data, config } = response;
  resolve(data?.data);
  if (data?.status_code !== 0) {
    errorReport({
      name: '接口errorCode报错',
      message: `url:${config?.url},code:${data?.status_code},params:${JSON.stringify(params)}`,
      stack: `接口返回为${JSON.stringify(data)}`
    });
  }
};
const successWithStatusCodeFn = (
  response: AxiosResponse<any>,
  resolve: (value: any) => void,
  params: any
) => {
  resolve(response.data);
};
// get,post失败返回执行的函数
const failFn = (error: Error, reject: (reason?: any) => void, params: any, url: string) => {
  errorReport({
    name: '接口报错',
    message: `url:${url},params:${JSON.stringify(params)},message:${error.message}`,
    stack: error.stack
  });
  reject(error);
};
class Request {
  /**
   * GET封装
   * @param {string} url 请求地址
   * @param {object} params 请求配置
   * @returns {Promise}
   */
  get(url: string, params: any, config?: AxiosRequestConfig | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      axiosWithCredentials
        .get(url, { params, ...config })
        .then((response: AxiosResponse<any>) => {
          successFn(response, resolve, params);
        })
        .catch((error: Error) => {
          failFn(error, reject, params, url);
        });
    });
  }
  getWithStatusCode(
    url: string,
    params: any,
    config?: AxiosRequestConfig | undefined
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      axiosWithCredentials
        .get(url, { params, ...config })
        .then((response: AxiosResponse<any>) => {
          successWithStatusCodeFn(response, resolve, params);
        })
        .catch((error: Error) => {
          failFn(error, reject, params, url);
        });
    });
  }
  getNoCookie(url: string, params: any, config?: AxiosRequestConfig | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(url, { params, ...config })
        .then((response: AxiosResponse<any>) => {
          successFn(response, resolve, params);
        })
        .catch((error: Error) => {
          failFn(error, reject, params, url);
        });
    });
  }
  /**
   * POST封装
   * @param {string} url 请求地址
   * @param {object} params 请求数据
   * @returns {Promise}
   */
  post(url: string, params: any, config: AxiosRequestConfig | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      axiosWithCredentials
        .post(url, params, config)
        .then((response: AxiosResponse<any>) => {
          successFn(response, resolve, params);
        })
        .catch((error: Error) => {
          failFn(error, reject, params, url);
        });
    });
  }

  /**
   * JSONP封装
   * @param {string} url 请求地址
   * @param {string} callbackName 回调函数名称
   * @returns
   */
  jsonp(url: string | string[], callbackName: string | undefined): Promise<any> {
    return new Promise(resolve => {
      if (typeof callbackName === 'function') {
        callbackName = void 0;
      }
      const randomNum: number = 1000;
      callbackName =
        callbackName || `jsonp_callback_ ${new Date()}${Math.round(randomNum * Math.random())}`;
      const script: HTMLScriptElement = document.createElement('script');
      (window as any)[callbackName] = function (data: unknown) {
        delete (window as any)[callbackName as string];
        document.body.removeChild(script);
        resolve(data);
      };
      script.src = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}callback=${callbackName}`;
      document.body.appendChild(script);
    });
  }
}
const request: Request = new Request();
export default request;
