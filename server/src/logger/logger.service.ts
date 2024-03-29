import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logger = new Logger();

  log(message: any, context?: string): any {
    this.logToLogFile(message, context);
  }

  error(message: any, trace?: string, context?: string): any {
    this.logToErrorFile(message, context);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logToLogFile(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    return;
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logToLogFile(message);
  }

  fatal?(message: any, ...optionalParams: any[]) {
    this.logToErrorFile(message);
  }

  private logToLogFile(message: any, context?: string) {
    const currentDate = new Date();
    this.writeToFile(
      'log.txt',
      `${this.getFormatedDateTime(currentDate)} [${context}] ${message}`,
    );
  }

  private logToErrorFile(message: any, context?: string) {
    const currentDate = new Date();

    this.writeToFile(
      'errors.txt',
      `${this.getFormatedDateTime(currentDate)} [${context}] ${message}`,
    );
  }

  private writeToFile(filename: string, content: string): void {
    var path = process.env.LOCAL_PATH_LOGS;
    fs.appendFileSync(`${path}/${filename}`, `${content}\n`);
  }

  private getFormatedDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    };

    return date.toLocaleString('de-CH', options).replace(',', '');
  }
}
