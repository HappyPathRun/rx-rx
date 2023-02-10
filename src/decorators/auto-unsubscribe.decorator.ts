interface Unsubscribable {
  unsubscribe(): void;
  closed: boolean;
  isStopped: boolean;
}

const AutoUnsusbscriber = Symbol('@AutoUnsubscribe');

export interface AutoUnsubscribeSettings {
  destructor?: string; /* The class method called when it is destroyed. Defaults to ngOnDestroy */
}

/**
 * Automatically unsubscribes any properties on this class that are subscriptions.
 * Additionally unsubscribes any results of methods that use the @Subscribes decorator.
 */
export function AutoUnsubscribe(settings: AutoUnsubscribeSettings = {}) {
  return function (constructor: any) {
    constructor.prototype[AutoUnsusbscriber] = true;
    const destructor = settings.destructor ?? 'ngOnDestroy';
    const orig = constructor.prototype[destructor];

    constructor.prototype[destructor] = function () {
      findSubscriptions(this).forEach((sub) => sub.unsubscribe());

      if (typeof orig !== 'undefined') {
        return orig.call(this);
      }
    };
  };
}

export interface SubscribesSettings {
  ignoreMissing?: boolean; /* If true, does not throw an error if the method does not return a subscription */
}

/**
 * Mark the return value of a method or a property as a subscription or array of subscriptions
 * that should be unsubscribed when a component is destroyed. Use this  with the
 * @AutoUnsubscribe decorator on the class level to automatically unsubscribe all
 * subscriptions.
 */
export function Subscribes(settings?: SubscribesSettings) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const throwError = (message: string) => {
      console.error('Error in @Subscribes decorator: ', {
        message,
        target,
        propertyKey,
        descriptor,
      });
      throw new Error(message);
    };

    const subKey = Symbol(`@Subscribes() for ${propertyKey}`);
    const originalMethod = descriptor.value;
    const addSubscriptions = (obj: any, result: any) => {
      if (!obj[AutoUnsusbscriber]) {
        throwError(
          '@Subscribes decorator can only be used on a class that has the @AutoUnsubscribe decorator'
        );
      }

      const items = isIterable(result) ? [...result] : [result];
      const subs = items.filter(isUnsubscribable);

      if (subs.length === 0 && !settings?.ignoreMissing) {
        throwError(
          '@Subscribes requires a method that returns a subscription or array with subscriptions'
        );
      }

      obj[subKey] = [...(obj[subKey] ?? []), ...subs];
    };

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      addSubscriptions(this, result);
      return result;
    };
  };
}

/**
 * Finds unsubscribable properties and symbols on the target object.
 * @param obj
 * @returns a flat array of unsubscribable functions
 */
export function findSubscriptions(obj: any): Unsubscribable[] {
  const keys = [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];

  const vals = flatten(keys.map((key) => obj[key]));
  const subs = vals.filter((val) => isUnsubscribable(val));

  return subs;
}

/**
 * Determines if the given object has an unsubscribe method or an array of objects
 * that have an unsubscribe method.
 *
 * @param obj
 * @returns boolean
 */
export function isUnsubscribable(obj: any): boolean {
  return obj?.unsubscribe instanceof Function;
}

/**
 * Determines if the object is iterable.
 *
 * @param obj
 * @returns boolean
 */
function isIterable(obj: any): boolean {
  return Symbol.iterator in Object(obj);
}

/**
 * Flattens an array of arrays into a single array
 * 
 * @param arr 
 * @returns array
 */
function flatten<T>(arr: T[]): T[] {
  return arr.reduce((acc, val) => acc.concat(val), [] as T[]);
}
