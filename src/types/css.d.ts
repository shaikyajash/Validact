// Allow importing plain CSS (and similar) as side-effect modules in TypeScript
// This file tells TS that imports like `import 'src/styles/index.css'` are valid.
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';

// If you use CSS modules, you can provide a stronger typing like:
// declare module '*.module.css' {
//   const classes: { [key: string]: string };
//   export default classes;
// }
