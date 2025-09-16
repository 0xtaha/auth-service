import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({
  timestamps: true,
  collection: 'logs',
})
export class Log {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  meta: any;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  userId?: string;

  @Prop()
  requestId?: string;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Index for faster querying
LogSchema.index({ timestamp: -1 });
LogSchema.index({ level: 1 });
LogSchema.index({ userId: 1 });