/// <reference types="react-scripts" />

/// <reference types="vite/client" />

// 声明 Less 模块
declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 声明 CSS 模块
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}