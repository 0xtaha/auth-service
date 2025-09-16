import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  async log(message: string, context?: any) {
    this.logger.info(message, context);
    await this.saveLog('info', message, context);
  }

  async error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
    await this.saveLog('error', message, { trace, context });
  }

  async warn(message: string, context?: any) {
    this.logger.warn(message, context);
    await this.saveLog('warn', message, context);
  }

  async debug(message: string, context?: any) {
    this.logger.debug(message, context);
    await this.saveLog('debug', message, context);
  }

  async verbose(message: string, context?: any) {
    this.logger.verbose(message, context);
    await this.saveLog('verbose', message, context);
  }

  private async saveLog(level: string, message: string, meta?: any) {
    try {
      const log = new this.logModel({
        level,
        message,
        meta,
        timestamp: new Date(),
      });
      await log.save();
    } catch (error) {
      console.error('Failed to save log to MongoDB:', error);
    }
  }
}