import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtTelegramGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      if (req.headers.cookie) {
        const cookies = req.headers.cookie.split('; ');
        let authCookie = '';
        cookies.forEach((cookie) => {
          if (cookie.split('=')[0] == 'Authentication') {
            authCookie = cookie.split('=')[1];
          }
        });
        const payload = this.jwtService.verify<TokenPayload>(authCookie);
        return new Promise(async (resolve, reject) => {
          this.userService
            .getById(payload.userId)
            .then((user) => {
              req.user = user;
              resolve(true);
            })
            .catch((err) =>
              reject(
                new HttpException(
                  'Пользователь неавторизован',
                  HttpStatus.UNAUTHORIZED,
                ),
              ),
            );
        });
      } else {
        const telegram = req.headers.telegram;
        if (!telegram) {
          throw new HttpException(
            'Пользователь неавторизован',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return new Promise(async (resolve, reject) => {
          req.user = this.userService
            .getByTelegram(telegram)
            .then((user) => {
              req.user = user;
              resolve(true);
            })
            .catch((err) =>
              reject(
                new HttpException(
                  'Пользователь неавторизован',
                  HttpStatus.UNAUTHORIZED,
                ),
              ),
            );
        });
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Пользователь неавторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
