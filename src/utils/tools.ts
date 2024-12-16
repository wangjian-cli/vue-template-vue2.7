import {
  OpenClientParam,
  ErrorReportParam,
  KLineFenshiId,
  KLineFenshiPeriod
} from '@/types/tools.d';

// 错误上报
const errorReport = ({ name, message, stack, category = 'js' }: ErrorReportParam) => {
  window.ClientMonitor.reportFrameErrors(
    {
      // 类型
      category: category,
      // 级别
      grade: 'Error'
    },
    {
      name,
      message,
      stack
    }
  );
};
// 节流
function throttle(cb: any, time: number) {
  let timer: NodeJS.Timeout | null;
  return function (...args: any) {
    if (timer) {
      return;
    }
    timer = setTimeout(function () {
      timer = null;
      cb(...args);
    }, time);
  };
}
//防抖
function debounce(fn: any, delay: number) {
  let timer: any = null;
  return function (...argu: any) {
    const args = argu;
    // @ts-ignore
    const context = this;
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}
// 打开客户端弹窗, mode常用的有5,6,8;5,6相同,6给pdf使用,8是无边框,15是给pdf使用
const openClient = ({
  link,
  mode,
  width = '1440',
  height = '900'
}: OpenClientParam): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    if (!link) {
      reject('链接异常');
    }
    if (!window.API) {
      reject('客户端方法异常');
    }
    window.API.use({
      method: 'Util.openURL2',
      data: { mode, width, height, url: link, useCef: true },
      notClient: () => {
        window.open(link);
        resolve('');
      },
      success: () => {
        resolve('');
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  }).catch((error: Error | string) => {
    errorReport({
      name: '打开客户端弹框失败',
      message: (error as Error)?.message || '',
      stack: (error as Error)?.stack || ''
    });
  });
};
// 打开反馈弹框
const openFeedBack = (link: string, id: number): Promise<unknown> => {
  let border: number = 0;
  return new Promise((resolve, reject) => {
    if (!link) {
      reject('链接异常');
    }
    if (!window.API) {
      reject('客户端方法异常');
    }
    const url = `${link}?border=${border}&entry=${id}`;
    window.API.use({
      method: 'Util.openIntegrateFeedBack',
      data: [url],
      notClient: () => {
        window.open(url);
      },
      success: () => {
        resolve('');
      },
      error: () => {
        border = 1;
        window.API.use({
          method: 'Util.openURL2',
          data: {
            url: `${link}?border=${border}&entry=${id}`,
            mode: '8',
            useCef: true
          },
          error: (error: Error) => {
            reject(error);
          }
        });
      }
    });
  }).catch((error: Error | string) => {
    errorReport({
      name: '打开反馈弹窗失败',
      message: (error as Error)?.message || '',
      stack: (error as Error)?.stack || ''
    });
  });
};

const closeClient = () => {
  // 调用关闭的客户端协议
  try {
    window.API.use({
      method: 'external.closeWebDlg'
    });
  } catch (error) {
    // 关闭客户端弹框错误上报
    errorReport({
      name: '关闭弹框错误',
      message: `客户端协议方法:{method: 'external.closeWebDlg'},message:${
        (error as Error).message
      }`,
      stack: (error as Error).stack
    });
  }
};

const jumpToKlineFenshi = (
  code: string,
  market: string,
  id: KLineFenshiId,
  period: KLineFenshiPeriod
) => {
  try {
    window.API.use({
      method: 'Quote.syncStockList',
      data: {
        id: id,
        code: code,
        market: market,
        period: period,
        stocklist: code,
        marketlist: market
      },
      success: () => {
        // 客户端协议
      }
    });
  } catch (error) {
    errorReport({
      name: '跳转k线或分时错误',
      message: `客户端协议方法:{method: 'Quote.syncStockList'}，id:${id},period:${period},message:${
        (error as Error).message
      }`,
      stack: (error as Error).stack
    });
  }
};
// dateplus
class DatePlus extends Date {
  constructor(args?: any) {
    args ? super(args) : super();
  }
  format(fmt = 'yyyy-MM-dd hh:mm:ss') {
    const quarterlyMonths = 3;
    const o = {
      //月份
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + quarterlyMonths) / quarterlyMonths),
      S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        `${this.getFullYear()}`.substr(quarterlyMonths + 1 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          // @ts-ignore
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
        );
      }
    }
    return fmt;
  }
}

// 函数重载
function getParam(paramName: string): string;
function getParam(): Record<string, string>;

function getParam(paramName?: string): string | Record<string, string> {
  const url = window.location.href;
  const queryString = url.substring(url.indexOf('?') + 1).replace(/#\/|\?/gi, '&');
  const paramsArray = queryString.split('&');
  const paramsObject: Record<string, string> = {};

  paramsArray.forEach(param => {
    const [key, value] = param.split('=');
    if (value) {
      paramsObject[key] = value;
    }
  });

  if (paramName === undefined) {
    return paramsObject;
  } else {
    return paramsObject[paramName] || '';
  }
}

const getAbs = (num: number) => {
  const result = Math.abs(num);
  return isNaN(result) ? num : result;
};

const NUM2 = 2;
function convertNumber(
  num: number,
  unit: 'tenThousand' | 'hundredMillion',
  fixedNum: number = NUM2
) {
  num = parseFloat(`${num}`);
  if (typeof num !== 'number') {
    return num;
  } else if (isNaN(num)) {
    return '--';
  } else {
    // sonar
  }

  // 使用英文单词作为单位的键
  const units = {
    tenThousand: 1e4,
    hundredMillion: 1e8
  };

  // 添加映射关系，将英文单词单位映射到汉字单位
  const unitNames = {
    tenThousand: '万',
    hundredMillion: '亿'
  };

  if (!units.hasOwnProperty(unit)) {
    return num;
  }

  const unitValue = units[unit];
  const unitName = unitNames[unit];

  if (num % unitValue === 0) {
    return `${num / unitValue} ${unitName}`;
  } else {
    return `${(num / unitValue).toFixed(fixedNum)} ${unitName}`;
  }
}

function getCookieValue(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key.trim() === name) {
      return value ? value.trim() : null;
    }
  }
  return null;
}

function getUserId(): Promise<string | void> {
  return new Promise<string | void>((resolve, reject) => {
    if (!window.API) {
      reject('客户端方法异常');
    }
    window.API.use({
      method: 'Passport.get',
      data: 'userid',
      success: function (num: number) {
        resolve(num + '');
      },
      notClient: () => {
        resolve(getCookieValue('userid') + '');
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  }).catch(error => {
    errorReport({
      name: '打开客户端弹框失败',
      message: (error as Error)?.message || '',
      stack: (error as Error)?.stack || ''
    });
  });
}

// 初始化onshow协议
const listenOnShow = (callback: Function) => {
  try {
    const e = window.API.createSessionId('external');
    window.API.use({
      method: 'external.registerEvent',
      data: 'onshow',
      persistent: true,
      sessionId: e,
      callbackName: 'onshow',
      success: (data: number) => {
        callback(!!data);
      },
      notClient: () => {
        callback(true);
      }
    });
  } catch (error) {
    errorReport({
      name: `客户端显隐方法失败 ${(error as Error)?.name}`,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack
    });
  }
};

// 保留两位小数
const reservedTwo = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '--';
  }
  const fixedNum = Number.isInteger(num) ? 0 : 2;
  return num.toFixed(fixedNum);
};

export {
  throttle,
  debounce,
  openClient,
  openFeedBack,
  errorReport,
  getParam,
  closeClient,
  DatePlus,
  jumpToKlineFenshi,
  getAbs,
  convertNumber,
  getUserId,
  listenOnShow,
  reservedTwo
};
