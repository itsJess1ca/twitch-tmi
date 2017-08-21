export const promiseTimeout = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));
