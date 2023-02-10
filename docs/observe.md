# Observe Decorator

The `@Observe()` decorator automatically creates an observable for you based on a class property.

If you're using Angular, instead of:

```
@Input() input: string;
```

You can use:

```
@Observe() @Input() input: string;
readonly input$: Observable<string>;
```

Then you can use the input$ variable as an observable version of your input string.

Why? Lots of reasons, but one big one: you can create transformed versions of your input
without worrying about subscriptions and adding an ngChanges implementation. Here's an example:

```
@Observe() formLoaded = false;
readonly formLoaded$: Observable<boolean>;

@Observe() entitiesLoaded = false;
readonly entitiesLoaded$: Observable<boolean>;

everythingLoaded$: Observable<boolean>;

ngOnInit() {
  this.everythingLoaded$ = combineLatest([this.formLoaded$, this.entitiesLoaded$])
    .pipe(map(([formReady, entitiesLoaded]) => formReady && entitiesLoaded));
}
```
