import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({
  timestamps: true,
  collection: 'blacklisted_tokens',
})
export class BlacklistedToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  blacklistedAt: Date;

  @Prop({ required: true, index: true })
  expiresAt: Date;
}

export const BlacklistedTokenSchema = SchemaFactory.createForClass(BlacklistedToken);

// Indexes
BlacklistedTokenSchema.index({ token: 1 });
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });