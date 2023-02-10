# TimePerformance

Use the `@TimePerformance` decorator to log the time it takes for a method to execute.

## Why?

We use this decorator occassionally to identify slow class methods or keep track of how often a method is called.

This decorator tracks the number of times a method is called, the total duration of all calls, the average duration of a call, and the start and end times of the first and last calls.

## Usage

```ts
import { TimePerformance } from "@happypath/rx-rx";

class MyClass {
  @TimePerformance()
  myMethod() {
    // Do something
  }
}
```
