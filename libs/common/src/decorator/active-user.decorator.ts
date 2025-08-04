import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../types/jwt.type';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

export const ActiveUser = createParamDecorator(
  (field: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: AccessTokenPayload | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);



export const WsUser = createParamDecorator(
  (field: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const user: AccessTokenPayload | undefined = client?.data?.user;
    return field ? user?.[field] : user;
  },
);
