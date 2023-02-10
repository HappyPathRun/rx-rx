import { BehaviorSubject } from 'rxjs';

/**
 * Automatically creates an observable based on a class property.
 *
 * Instead of:
 *
 *   @Input() input: string;
 *
 * You can do:
 *
 *  @Observe() @Input() input: string;
 *  readonly input$: Observable<string>;
 *
 * Then you can use the input$ variable as an observable version of your input string.
 *
 * Why? Lots of reasons, but one big one: you can create transformed versions of your input
 * without worrying about subscriptions and adding an ngChanges implementation. Here's an example:
 *
 *   isEverythingReady$: Observable<boolean>;
 *   this.isEverythingReady$ = combineLatest([this.isFormReady$, this.areEntitiesLoaded$])
 *     .pipe(map(([formReady, entitiesLoaded]) => formReady && entitiesLoaded));
 *
 */
export function Observe(observableName?: string) {
  return function (target: any, key: string) {
    const observableKey = observableName ?? `${key}$`;
    const keySymbol = Symbol();
    const subjectSymbol = Symbol();
    const observableSymbol = Symbol();

    // Initializes the subject and observable on an instance
    const init = (instance: any) => {
      if (!instance[subjectSymbol] && !instance[observableSymbol]) {
        instance[subjectSymbol] = new BehaviorSubject(instance[key]);
        instance[observableSymbol] = instance[subjectSymbol].asObservable();
      }
    };

    const subject = (instance: any) => {
      init(instance);
      return instance[subjectSymbol];
    };

    const observable = (instance: any) => {
      init(instance);
      return instance[observableSymbol];
    };

    // Override the input property to use getter/setters
    Object.defineProperty(target, key, {
      set: function (value) {
        this[keySymbol] = value;
        subject(this).next(value);
      },
      get: function () {
        return this[keySymbol];
      },
    });

    // Override the observable property
    Object.defineProperty(target, observableKey, {
      get: function () {
        return observable(this);
      },
    });
  };
}
