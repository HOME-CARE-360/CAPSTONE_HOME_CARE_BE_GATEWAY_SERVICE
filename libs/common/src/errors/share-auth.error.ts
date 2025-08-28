import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

export const UnauthorizedAccessException = new UnauthorizedException(
  'Unauthorized access',
);

export const InvalidAccessTokenException = new UnauthorizedException(
  'Invalid access token',
);

export const MissingAccessTokenException = new UnauthorizedException(
  'Access token is missing',
);

export const ForbiddenExceptionRpc = new ForbiddenException(
  'Access to this resource is forbidden',
);
