import chalk from "chalk";
import { injectable } from "tsyringe";

export enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

@injectable()
export class LoggerUtil {
  private static log(level: LogLevel, label: string, message: string): void {
    const coloredLabel = chalk.bgWhite.black(` ${label} `);
    const coloredMessage =
      level === LogLevel.ERROR ? chalk.red(message) : message;

    console.log(
      `[${new Date().toISOString()}] [${level}] ${coloredLabel} ${coloredMessage}`
    );
  }

  static info(label: string, message: string): void {
    this.log(LogLevel.INFO, label, message);
  }

  static warning(label: string, message: string): void {
    this.log(LogLevel.WARNING, label, message);
  }

  static error(label: string, message: string): void {
    this.log(LogLevel.ERROR, label, message);
  }
}
