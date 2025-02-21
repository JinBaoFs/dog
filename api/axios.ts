import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import REQUEST_API from './api';
import { interAxiosRequestConfig, requestsType, axiosUrlType } from './type';

const axios = Axios.create({
  timeout: 1300000
});

function parseCookies(cookieString: string) {
  return cookieString.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {} as any);
}

let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式

let requests: requestsType[] = [];

axios.interceptors.request.use(
  (config: any) => {
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8',
      language:
        typeof document !== 'undefined'
          ? parseCookies(document.cookie)['NEXT_LOCALE']
          : 'en',
      'X-Token': typeof document !== 'undefined' ? getToken() : ''
    };
    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const code = response.data.status;
    if (code === 203) {
      // 执行登录失效流程
    }
    if (code === '203') {
      const config: AxiosRequestConfig = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return getRefreshTokenFunc()
          .then(() => {
            (config.headers as interAxiosRequestConfig)['Authorization'] =
              getToken();
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => {
              cb(getToken());
            });
            // 重试完清空这个队列
            requests = [];
            return axios(config);
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，返回一个未执行resolve的promise
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          // @ts-ignore
          requests.push(token => {
            config.baseURL = '';
            (config.headers as interAxiosRequestConfig)['Authorization'] =
              token;
            resolve(axios(config));
          });
        });
      }
    }
    return response.data;
  },
  (error: any) => {
    console.log(error.message);
    if (Axios.isCancel(error)) {
      return Promise.reject({
        code: 500,
        msg: error.message,
        data: null
      });
    }
    if (error.response) {
      const st = error.response.status;
      if (st === 401) {
        // 执行退出登录操作
      }
    }
  }
);
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
axios.defaults.baseURL = baseUrl;

export const enum ajaxMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put'
}

export const ajaxGet = async <T>(url: axiosUrlType & string, params = {}) => {
  return await doAjax<T>(url, params, ajaxMethod.GET);
};
export const ajaxPost = async <T>(url: axiosUrlType & string, params = {}) =>
  await (<T>doAjax(url, params, ajaxMethod.POST));
export const ajaxDelete = async <T>(url: axiosUrlType & string, params = {}) =>
  await doAjax<T>(url, params, ajaxMethod.DELETE);
export const ajaxPut = async <T>(url: axiosUrlType & string, params = {}) =>
  await doAjax<T>(url, params, ajaxMethod.PUT);

type paramsType = {
  urlParams?: string | number;
  [key: string]: any;
};

const doAjax = <T>(
  url: axiosUrlType & string,
  params: paramsType = {},
  type: ajaxMethod
): Promise<T> => {
  const { urlParams, ...otherParams } = params;
  if (!['uploadImg', 'authLogin', 'ossUploadImg'].includes(url)) {
    params = otherParams;
  }
  const urlStr = `${REQUEST_API[url] || url}${
    urlParams ? `/${urlParams}` : ''
  }`;
  return axios[type](
    urlStr,
    ['get', 'delete'].includes(type)
      ? {
          params
        }
      : params
  );
};

const getToken = () => {
  const token = localStorage.getItem('redux_localstorage_simple_userInfo');
  return token ? 'Bearer ' + JSON.parse(token).token : '';
};
const getRefreshTokenFunc = () => {
  return ajaxPost('refreshToken' as axiosUrlType, {
    accessToken: getToken()
  });
};
