import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenBlacklistService } from './token-blacklist.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerModule } from '../logger/logger.module';
import { BlacklistedToken, BlacklistedTokenSchema } from '../schemas/blacklisted-token.schema';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    LoggerModule,
    MongooseModule.forFeature([
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, TokenBlacklistService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, TokenBlacklistService],
})

export class AuthModule {}