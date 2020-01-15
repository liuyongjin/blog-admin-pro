/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { parse } from 'qs';
const moment =require('moment');
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

// export const BASE_URL='http://blog.com';
export const BASE_URL='http://api.liuyongjin.cn';

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  // if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  //   return true;
  // }
  // return window.location.hostname === 'preview.pro.ant.design';
  return true;
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  // const { NODE_ENV } = process.env;
  // if (NODE_ENV === 'development') {
  //   return true;
  // }
  return false
};


export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('__BLOG__ADMIN__PRO__AUTHORITY', JSON.stringify(proAuthority));
}

const TOKEN_KEY='__BLOG__ADMIN__PRO__TOKEN__';

export function setToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
  return localStorage.getItem(TOKEN_KEY)||'';
}

export function formatDate(value:any){
  return moment(value).format('YYYY-MM-DD');
}