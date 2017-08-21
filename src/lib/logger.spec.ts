import { formatDate, logger } from './logger';
import * as timemachine from 'timemachine';
import Mock = jest.Mock;

beforeAll(() => {
  (global.console as any) = {
    log: jest.fn()
  };

  timemachine.config({
    dateString: '05/05/05 15:32'
  });
});

it('should format the date correctly', () => {
  const date = new Date('05/05/05 15:32');
  expect(formatDate(date)).toEqual('15:32');
});

it('should log each method called', () => {
  logger.trace('trace');
  expect(console.log).toBeCalledWith('[15:32] trace:', 'trace');
  logger.debug('debug');
  expect(console.log).toBeCalledWith('[15:32] debug:', 'debug');
  logger.info('test');
  expect(console.log).toBeCalledWith('[15:32] info:', 'test');
  logger.warn('warn');
  expect(console.log).toBeCalledWith('[15:32] warn:', 'warn');
  logger.error('error');
  expect(console.log).toBeCalledWith('[15:32] error:', 'error');
  logger.fatal('fatal');
  expect(console.log).toBeCalledWith('[15:32] fatal:', 'fatal');
});

it('should allow changing the logging level', () => {
  logger.trace('trace');
  expect(console.log).toBeCalledWith('[15:32] trace:', 'trace');

  (console.log as Mock<any>).mockReset();
  logger.setLoggingLevel('info');
  logger.trace('trace');
  expect(console.log).not.toBeCalled();

});
