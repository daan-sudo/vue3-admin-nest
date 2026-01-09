// src/types/svg-captcha.d.ts
declare module 'svg-captcha' {
  export interface ConfigObject {
    size?: number;
    ignoreChars?: string;
    noise?: number;
    color?: boolean;
    background?: string;
    width?: number;
    height?: number;
    fontSize?: number;
    charPreset?: string;
    inverse?: boolean;
  }

  export interface CaptchaObj {
    data: string; // SVG 字符串
    text: string; // 验证码文本
  }

  export function create(options?: ConfigObject): CaptchaObj;

  // 重点是补上这个方法定义
  export function createMathExpr(options?: ConfigObject): CaptchaObj;

  export function loadFont(url: string): void;
  export const options: ConfigObject;
}
