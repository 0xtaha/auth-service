import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Sanitize request body (body is the only mutable property)
    if (request.body && typeof request.body === 'object') {
      const sanitizedBody = this.sanitizeObject(request.body);
      request.body = sanitizedBody;
    }

    return next.handle().pipe(
      map(data => {
        // Sanitize response data
        return this.sanitizeObject(data);
      }),
    );
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Don't sanitize passwords to preserve special characters
          if (key.toLowerCase().includes('password')) {
            sanitized[key] = obj[key];
          } else {
            sanitized[key] = this.sanitizeObject(obj[key]);
          }
        }
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }
    
    // Remove any HTML tags and script injections
    let sanitized = str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    
    // Remove all HTML tags except for safe ones
    sanitized = sanitized.replace(/<(?!\/?(?:br|p|strong|em|u|i|b)\s*\/?>)[^>]+>/gi, '');
    
    // Escape special HTML characters
    const htmlEscapes: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    
    // Only escape characters that appear in suspicious contexts
    if (/<|>|"|'|\//.test(sanitized)) {
      // Check if it looks like an attack attempt
      if (/<\w|on\w+=/i.test(sanitized)) {
        sanitized = sanitized.replace(/[<>"'\/]/g, match => htmlEscapes[match] || match);
      }
    }
    return sanitized;
  }
}