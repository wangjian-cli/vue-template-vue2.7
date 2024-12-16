/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ErrInfo {
  //错误名称或地址，没有可传'-'
  name?: string;
  //错误信息
  message?: string;
  //错误堆栈信息
  stack?: string;
}
interface Options extends ErrInfo {
  // 类型
  category: 'js' | 'ajax';
  // 级别
  grade: 'Error';
}
declare interface Window {
  API: any;
  TA: any;
  svelteSdk: any;
  Acme: any;
  ClientMonitor: {
    reportFrameErrors: (arg0: Options, arg1?: ErrInfo) => void;
  };
  Disclaimer: any;
}
declare const scrollErrorMsg: string;
declare const homePageId: string;
declare const pdfPageId: string;
