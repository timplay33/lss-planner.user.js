declare module "*.hbs" {
  const tpl: (context?: any) => string;
  export default tpl;
}
