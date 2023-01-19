enum Os {
  iphone = 'iphone',
  gphone = 'gphone'
}
interface ErrorReportParam {
  name: string;
  message: string;
  stack: string | undefined;
}
export type { ErrorReportParam };
export { Os };
