import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Observe } from './observe.decorator';

class TestClass {
  @Observe() stringProp = 'Hello';
  stringProp$!: Observable<string>;
  
  @Observe('aBoolProp$') boolProp = false;
  aBoolProp$!: Observable<boolean>;
}

it('should create an observable', () => {
  const test = new TestClass();
  expect(test.stringProp$).toBeInstanceOf(Observable);
});

it('should respond to input changes', () => {
  const test = new TestClass();

  test.stringProp$.pipe(first()).subscribe((value) => {
    expect(value).toBe('Hello');
  });

  test.stringProp = 'Observable';
  test.stringProp$.pipe(first()).subscribe((value) => {
    expect(value).toBe('Observable');
  });
});

it('should use the passed observable name', () => {
  const test = new TestClass();
  expect(test.aBoolProp$).toBeInstanceOf(Observable);
});
