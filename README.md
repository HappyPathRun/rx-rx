# Rx Rx

`@happypath/rx-rx` contains utility functions that we use for Angular and RxJs.

## Installation

`npm install @happypath/rx-rx` or `yarn add @happypath/rx-rx`

## Requirements

This library uses TypeScript decorators, so you'll need to enable the `experimentalDecorators` compiler option in your `tsconfig.json` file.

## Features

- [`@Observe`](docs/observe.md) - A decorator that creates an observable for you based on a class property.
- [`@AutoUnsubscribe` and `@Subscribes`](docs/auto-unsubscribe.md) - A pair of decorators that automatically unsubscribes from observables when a component is destroyed.
- [`@TimePerformance`](docs/time-performance.md) - A decorator that logs the time it takes for a method to execute.
