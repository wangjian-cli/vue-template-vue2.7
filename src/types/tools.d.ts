interface OpenClientParam {
  mode: number | string;
  link: string;
  width?: string;
  height?: string;
}
interface ErrorReportParam {
  name: string;
  message: string;
  stack: string | undefined;
  category?: 'ajax' | 'js';
}
export enum KLineFenshiId {
  kLine = 65,
  fenshi = 379
}
export enum KLineFenshiPeriod {
  kLine = '16384',
  fenshi = '8192'
}
export { type OpenClientParam, type ErrorReportParam };
