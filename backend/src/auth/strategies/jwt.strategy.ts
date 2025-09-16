import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      passReqToCallback: true,
    };
    
    super(options);
  }

  async validate(request: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if ( token == null) {
      throw new UnauthorizedException('Token Not Valid');
    }

    const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been invalidated');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };
  }
}