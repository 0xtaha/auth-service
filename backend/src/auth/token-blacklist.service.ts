import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken, BlacklistedTokenDocument } from '../schemas/blacklisted-token.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectModel(BlacklistedToken.name) 
    private blacklistModel: Model<BlacklistedTokenDocument>,
  ) {}

  async addToBlacklist(token: string, userId: string): Promise<void> {
    const blacklistedToken = new this.blacklistModel({
      token,
      userId,
      blacklistedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    await blacklistedToken.save();
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistModel
      .findOne({ token })
      .exec();
    return !!blacklistedToken;
  }

  // Clean up expired tokens daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    await this.blacklistModel
      .deleteMany({ expiresAt: { $lt: new Date() } })
      .exec();
  }
}