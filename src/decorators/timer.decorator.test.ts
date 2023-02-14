import { Timer, TimerLogEntry } from "./timer.decorator";

let logEntries: TimerLogEntry[] = [];
const log = (entry: TimerLogEntry) => logEntries.push(entry);

class MyClass {
  skipCount = 0;
  skipMax = 3;

  @Timer({ log })
  public testDefaults(): void {
    // Do nothing
  }

  @Timer({
    log,
    label: () => "MyClass.testLabel",
  })
  testLabel(): void {
    // Do nothing
  }

  @Timer({
    log,
    skip: ({ target }) => target.skipCount >= target.skipMax,
  })
  testSkip(): number {
    this.skipCount++;
    return this.skipCount;
  }

  @Timer({
    log,
    label: ({ propertyKey }, args) => `${propertyKey.toString()}-${args[0]}`,
  })
  testLabelWithArgs(arg: string): void {
    // Do nothing
  }
}

beforeEach(() => {
  logEntries = [];
});

it("should log the time performance", () => {
  const myClass = new MyClass();
  myClass.testDefaults();

  expect(logEntries.length).toBe(1);
  const entry = logEntries[0];
  expect(entry.label).toBe("testDefaults");
  expect(entry.propertyKey).toBe("testDefaults");
  expect(entry.call).toBe(1);
});

it("should log the time performance with a label", () => {
  const myClass = new MyClass();
  myClass.testLabel();

  expect(logEntries.length).toBe(1);
  const entry = logEntries[0];
  expect(entry.label).toBe("MyClass.testLabel");
  expect(entry.propertyKey).toBe("testLabel");
  expect(entry.call).toBe(1);
});

it("should skip logging when skip returns true", () => {
  const myClass = new MyClass();
  for (let i = 0; i < myClass.skipMax; i++) {
    const count = myClass.testSkip();
    expect(count).toBe(i + 1);
  }

  expect(logEntries.length).toBe(myClass.skipMax);
  logEntries.forEach((entry, index) => {
    expect(entry.label).toBe("testSkip");
    expect(entry.propertyKey).toBe("testSkip");
    expect(entry.call).toBe(index + 1);
  });
});

it("should log the time performance with a label and args", () => {
  const myClass = new MyClass();
  myClass.testLabelWithArgs("test");

  expect(logEntries.length).toBe(1);
  const entry = logEntries[0];
  expect(entry.label).toBe("testLabelWithArgs-test");
  expect(entry.propertyKey).toBe("testLabelWithArgs");
  expect(entry.call).toBe(1);
});
