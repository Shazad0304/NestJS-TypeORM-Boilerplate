import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private role : string) {}

  canActivate(context: ExecutionContext): boolean {
    const roles : any[] = [{id:1 , value:"admin"},{id:2, value: "user"}];
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest() as any;
    const user = req.user;
    return roles.find(x => x.value === this.role).id === user.roleId;
  }
}
