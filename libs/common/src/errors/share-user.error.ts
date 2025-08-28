import { RpcException } from '@nestjs/microservices';

export const UserNotFoundException = new RpcException({
  message: 'User not found',
  path: 'code',
});
