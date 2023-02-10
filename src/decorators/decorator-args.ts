export interface DecoratorArgs {
  target: any;
  propertyKey: string | symbol;
  descriptor: PropertyDescriptor;
}