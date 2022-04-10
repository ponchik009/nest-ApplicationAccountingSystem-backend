import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import RequestWithUser from '../interface/requestWithUser.interface';
import { WORKGROUPS_KEY } from '../workgroups.decorator';

@Injectable()
export class WorkgroupsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const workgroups = this.reflector.get<string[]>(
        WORKGROUPS_KEY,
        context.getHandler(),
      );

      if (!workgroups) {
        return true;
      }

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user: User = req.user;

      if (!workgroups.includes(user.workgroup.role.name))
        throw new HttpException('Отказано в доступе', HttpStatus.FORBIDDEN);

      return true;
    } catch (err) {
      console.log(err);
      throw new HttpException('Отказано в доступе', HttpStatus.FORBIDDEN);
    }
  }
}
