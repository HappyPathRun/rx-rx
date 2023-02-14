import { DecoratorArgs } from "./decorator-args";

export interface TimerOptions {
  label?: (
    decoratorArgs: DecoratorArgs,
    methodArgs: any[]
  ) => string /* Label to use for the log entry */;
  skip?: (
    decoratorArgs: DecoratorArgs,
    methodArgs: any[]
  ) => boolean /* Return true to skip logging */;
  log?: (
    entry: TimerLogEntry
  ) => void /* Log function to use. Defaults to console.table */;
}

export interface TimerLogEntry {
  label: string;
  propertyKey: string | symbol;
  call: number;
  duration: number;
  start: number;
  end: number;
  totalDuration: number;
  avgDuration: number;
  args: string;
}

/**
 * Use @Timer to apply a timer to a class method.
 * Track the time each specified method takes to execute.
 *
 * @param options
 */
export function Timer(options: TimerOptions = {}) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const decoratorArgs = { target, propertyKey, descriptor };
    const calls = new Map<string | symbol, number>();
    let totalDuration = 0;
    const originalMethod = descriptor.value;
    const log = options.log ?? console.table;

    descriptor.value = function (...args: any[]) {
      const shouldSkip = options.skip?.(decoratorArgs, args) ?? false;

      if (shouldSkip) {
        return originalMethod.apply(this, args);
      }

      const label =
        options.label?.(decoratorArgs, args) ?? propertyKey.toString();
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();

      const duration = end - start;
      const prevCall = calls.get(propertyKey) || 0;
      const call = prevCall + 1;
      calls.set(propertyKey, call);
      totalDuration += duration;
      const avgDuration = totalDuration / calls.size;

      log({
        label,
        propertyKey,
        call,
        duration,
        start,
        end,
        totalDuration,
        avgDuration,
        args: JSON.stringify(args),
      });

      return result;
    };
  };
}
