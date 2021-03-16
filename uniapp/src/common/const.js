/**
 * 项目中定义的常量
 * 开发|测试：.env.development
 * 正式：.env.producment
 */

export const VERSION = '2.3.210312';

export const DISCUZ_TITLE = process.env.VUE_APP_TITLE;

let host = process.env.VUE_APP_REQUEST_HOST;

// #ifdef H5
if (process.env.NODE_ENV !== 'development') {
  host = `${window.location.origin}/`;
}
// #endif

export const DISCUZ_REQUEST_HOST = host;// 会有两个版本一个是开发版process.env.VUE_APP_REQUEST_HOST，一个是正式版host = `${window.location.origin}/`;
// export const DISCUZ_REQUEST_HOST = 'http://172.16.1.34/';
/**
 * cookie 相关
 */
// 存储到 cookie 中的当前语言 key 值
export const COOKIE_CURRENT_LANGUAGE = '__discuzq_lang';
export const STORGE_GET_USER_TIME = '__discuzq_getusertime';

/**
 * 主题
 */
export const THEME_DEFAULT = 'light';
export const THEME_DARK = 'dark';

/**
 * 语言
 */
export const LANG_ZH = 'zh';
export const LANG_EN = 'en';

export const SITE_PAY = 'pay';
