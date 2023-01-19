import Axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
const statusNum = 200;

function getAxios(withCredentials: boolean): AxiosInstance {
  const axios: AxiosInstance = Axios.create({
    withCredentials,
    // 请求超时 3s
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 前置拦截器（发起请求之前的拦截）
  axios.interceptors.request.use(
    (response: AxiosRequestConfig) =>
      /**
       * 根据你的项目实际情况来对 config 做处理
       * 这里对 config 不做任何处理，直接返回
       */
      response,
    (error: any) => Promise.reject(error)
  );

  // 后置拦截器（获取到响应时的拦截）
  axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      if (response.status === statusNum) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    (error: any) =>
      /**
       * 异常处理
       */
      Promise.reject(error)
  );
  return axios;
}
const axiosWithCredentials: AxiosInstance = getAxios(true);
const axiosInstance: AxiosInstance = getAxios(false);
export { axiosWithCredentials, axiosInstance };
