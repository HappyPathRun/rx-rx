# Auto-Unsubscribe and Subscribes

Add the `@AutoUnsubscribe` decorator to a class or Angular component to register for automatic subscription management. Once this decorator is added, any class methods that return a subscription or array of subscriptions and are decorated with `@Subscribes` will be automatically unsubscribed from when the component is destroyed.

We use this pattern in an Angular project that has a legacy technique for managing subscriptions. Previously, our components had a `Subscription[]` property that we'd use to track subscriptions. When the component was destroyed, we would manually unsubscribe from all of the subscriptions in the array. Because of this, the `@AutoUnsubscribe` decorator also supports unsubscribing from any class properties that are typed as `Subscription` or `Subscription[]`.

## Why?

Subscription management is a common source of memory leaks in Angular applications. These decorators reduce the boilerplate code required to track and unsubscribe from subscriptions in a component.

## Usage

```ts
@AutoUnsubscribe()
@Component()
export class MyComponent implements OnInit {
  constructor(private myService: MyService);

  ngOnInit() {
    this.myMethod();
  }

  @Subscribes()
  private myMethod(): Subscription[] {
    return [
      this.myService
        .fetchSomething()
        .subscribe((result) => console.log(result)),

      this.myService
        .fetchSomethingElse()
        .subscribe((result) => console.log(result)),
    ];
  }
}
```
