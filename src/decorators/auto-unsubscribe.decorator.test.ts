import {
  AutoUnsubscribe,
  findSubscriptions,
  isUnsubscribable,
  Subscribes,
} from './auto-unsubscribe.decorator';

@AutoUnsubscribe({ destructor: 'destroy' })
class TestAutoUnsubscribeComponent {
  unsubscribed: string[];
  subscriptions: { unsubscribe: () => void }[];

  constructor() {
    this.unsubscribed = [];
    this.subscriptions = [
      {
        unsubscribe: () => this.unsubscribed.push('old school subscription'),
      },
    ];
  }

  init(): void {
    this.withoutDecorator();
    this.subscriptionArray();
    this.singleSubscribes();
  }

  destroy(): void {}

  withoutDecorator() {
    return { unsubscribe: () => this.unsubscribed.push('without') };
  }

  @Subscribes()
  uncalled() {
    return { unsubscribe: () => this.unsubscribed.push('uncalled') };
  }

  @Subscribes()
  subscriptionArray() {
    return [
      { unsubscribe: () => this.unsubscribed.push('array item 0') },
      { unsubscribe: () => this.unsubscribed.push('array item 1') },
      { nothing: () => this.unsubscribed.push('array item 2') },
    ];
  }

  @Subscribes()
  singleSubscribes() {
    return { unsubscribe: () => this.unsubscribed.push('single') };
  }
}

let component: TestAutoUnsubscribeComponent;

beforeEach(() => {
  component = new TestAutoUnsubscribeComponent();
  component.init();
});

it('should findSubscriptions', () => {
  expect(findSubscriptions(component).length).toBe(4);

  component.singleSubscribes();
  expect(findSubscriptions(component).length).toBe(5);

  component.subscriptionArray();
  expect(findSubscriptions(component).length).toBe(7);
});

it('isUnsubscribable without decorator', () => {
  expect(isUnsubscribable(component.withoutDecorator())).toBe(true);
});

it('isUnsubscribable subscription array', () => {
  expect(isUnsubscribable(component.subscriptionArray())).toBe(false);
});

it('isUnsubscribable single subscription', () => {
  expect(isUnsubscribable(component.singleSubscribes())).toBe(true);
});

it('should unsubscribe subscriptions', () => {
  const unsubs = findSubscriptions(component);
  expect(unsubs.length).toBe(4);
  component.destroy();

  expect(component.unsubscribed).toEqual([
    'old school subscription',
    'array item 0',
    'array item 1',
    'single',
  ]);
});
