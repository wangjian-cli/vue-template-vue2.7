import { Os, ErrorReportParam } from '@/types/toolsType';
class DatePlus extends Date {
  constructor(args: any) {
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

function getGphoneVersion() {
  const ua: string = navigator.userAgent.toLowerCase();
  let version: null | string = null;

  if (ua.indexOf('android') > 0) {
    const reg = /android [\d._]+/gi;
    const vInfo = ua.match(reg);
    version = `${vInfo}`.replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.');
  }

  return version;
}

function getIphoneVersion() {
  const ua: string = navigator.userAgent.toLowerCase();
  let version: null | string = null;

  if (ua.indexOf('like mac os x') > 0) {
    const reg = /os [\d._]+/gi;
    const vInfo = ua.match(reg);
    version = `${vInfo}`.replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.');
  }

  return version;
}

function getOS(): {
  sys: Os;
  version: string | null;
} {
  const sys: Os = /(iphone)|(mac)|(ipad)/gi.test(navigator.userAgent) ? Os.iphone : Os.gphone;
  return {
    sys,
    version: sys === 'iphone' ? getIphoneVersion() : getGphoneVersion()
  };
}

function setTitle(str: string) {
  document.title = str;
  if (/hexin/gi.test(navigator.userAgent)) {
    if (navigator.userAgent.toLowerCase().indexOf('android') > 0) {
      window.callNativeHandler(
        'changeWebViewTitle',
        {
          title: str,
          url: ''
        },
        function () {
          // 客户端协议空函数
        }
      );
    } else {
      window.callNativeHandler('updateTitleAutomatically');
    }
  }
}

function androidCanBackProtocol() {
  if (/hexin/gi.test(navigator.userAgent) && getOS().sys === Os.gphone) {
    const data = {
      method: 'setBrowserField',
      params: {
        isUseDefaultBack: 'true'
      }
    };
    window.callNativeHandler('notifyWebHandleEvent', JSON.stringify(data));
  }
}

function loadJs(url: string, nextFn: Function) {
  const body = document.getElementsByTagName('body')[0];
  const jsNode = document.createElement('script');
  jsNode.setAttribute('type', 'text/javascript');
  jsNode.setAttribute('src', url);
  jsNode.onload = function () {
    nextFn && nextFn();
  };
  body.appendChild(jsNode);
}

function checkLogin(nextFn: Function) {
  if (window.getAppVersion()) {
    if (window.getAccount()) {
      typeof nextFn === 'function' && nextFn();
    } else {
      window.location.href = 'http://eqhexin/changeUser';
    }
  } else {
    if (window.getUserid()) {
      typeof nextFn === 'function' && nextFn();
    } else {
      if (window.wechatLogin) {
        window.wechatLogin(encodeURIComponent(window.location.href));
      } else {
        loadJs('https://upass.10jqka.com.cn/asset/wechatlogin/js/checkwechat.js', function () {
          window.wechatLogin(encodeURIComponent(window.location.href));
        });
      }
    }
  }
}

function jumpToFenShi(stockCode: string, marketId: string) {
  location.href = `client://client.html?action=ymtz^webid=2205^stockcode=${stockCode}^marketid=${marketId}`;
}

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
function jumpBy2804(url: string, needhardwareAccelerated = false) {
  const hardwareAccelerated =
    needhardwareAccelerated && window.getPlatform() === Os.gphone
      ? '^hardwareAccelerated=true'
      : '';
  if (!url || typeof url !== 'string') {
    return;
  }
  if (window.getAppVersion() && url.indexOf('client.html') === -1) {
    !url.startsWith('http') && (url = location.protocol + url);
    location.href = `client://client.html?action=ymtz^webid=2804^mode=new^url=${url}${hardwareAccelerated}`;
  } else {
    location.href = url;
  }
}

// 错误上报
const errorReport = ({ name, message, stack }: ErrorReportParam) => {
  window.ClientMonitor.reportFrameErrors(
    {
      // 类型
      category: 'js',
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
export {
  DatePlus,
  getOS,
  setTitle,
  androidCanBackProtocol,
  checkLogin,
  jumpToFenShi,
  jumpBy2804,
  throttle,
  debounce,
  errorReport
};
