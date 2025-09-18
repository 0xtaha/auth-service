import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class XssGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check request body for XSS attempts
    if (request.body) {
      this.validateObject(request.body);
    }
    
    return true;
  }

  private validateObject(obj: any, path = ''): void {
    if (obj === null || obj === undefined) {
      return;
    }

    if (typeof obj === 'string') {
      this.validateString(obj, path);
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.validateObject(item, `${path}[${index}]`);
      });
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Skip password fields
          if (!key.toLowerCase().includes('password')) {
            this.validateObject(obj[key], path ? `${path}.${key}` : key);
          }
        }
      }
    }
  }

  private validateString(str: string, fieldName: string): void {
    if (typeof str !== 'string') {
      return;
    }

    // List of dangerous patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<embed/gi,
      /<object/gi,
      /<link/gi,
      /<meta/gi,
      /document\.(cookie|write|domain)/gi,
      /window\.(location|open)/gi,
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /Function\s*\(/gi,
      /\.innerHTML\s*=/gi,
      /\.outerHTML\s*=/gi,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(str)) {
        throw new BadRequestException(
          `Potentially malicious content detected in field: ${fieldName}. Please remove any HTML, scripts, or special characters and try again.`
        );
      }
    }

    // Check for encoded XSS attempts
    const decodedStr = this.decodeHtml(str);
    if (decodedStr !== str) {
      // Re-check decoded string
      for (const pattern of xssPatterns) {
        if (pattern.test(decodedStr)) {
          throw new BadRequestException(
            `Potentially malicious encoded content detected in field: ${fieldName}.`
          );
        }
      }
    }
  }

  private decodeHtml(str: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
      '&amp;': '&',
    };

    return str.replace(
      /&lt;|&gt;|&quot;|&#x27;|&#x2F;|&amp;/g,
      match => htmlEntities[match] || match
    );
  }
}