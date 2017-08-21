

export class Timer {
  private defaultDelay: number;
  private index: number;
  private queue: any[];

  constructor(delay?: number) {
    this.index = 0;
    this.queue = [];
    this.defaultDelay = delay || 3000;
  }

  add(fn: Function, delay?: number) {
    this.queue.push({
      fn,
      delay
    });
  }

  run(index?: number) {
    (index || index === 0) && (this.index = index);
    this.next();
  }

  next() {
    const i = this.index++;
    const at = this.queue[i];
    const next = this.queue[this.index];

    if (!at) return;

    at.fn();
    next && setTimeout(() => {
      this.next();
    }, next.delay || this.defaultDelay);
  }

  reset() {
    this.index = 0;
  }

  clear() {
    this.index = 0;
    this.queue = [];
  }
}
