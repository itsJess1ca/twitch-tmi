export const _LoggingLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
};
export type LoggingLevels = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

let loggingLevel: LoggingLevels = 'trace';

export const formatDate = (date: Date): string => {
  const hours = date.getHours();
  const mins  = date.getMinutes();

  const parseNumber = (int: number) => {
    return (int < 10 ? "0" : "") + int;
  };

  return `${parseNumber(hours)}:${parseNumber(mins)}`;
};

const log = (level: LoggingLevels) => (...args) => {
  if (_LoggingLevels[level] >= _LoggingLevels[loggingLevel]) {
    console.log(`[${formatDate(new Date())}] ${level}:`, ...args);
  }
};

export const logger = {
  setLoggingLevel: (level: LoggingLevels) => {
    loggingLevel = level;
  },
  trace: log("trace"),
  debug: log("debug"),
  info: log("info"),
  warn: log("warn"),
  error: log("error"),
  fatal: log("fatal"),
};

