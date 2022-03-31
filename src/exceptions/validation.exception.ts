import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(private messages: string[]) {
    super(messages, HttpStatus.BAD_REQUEST);
  }
}
