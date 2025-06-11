import { UnauthorizedException, ForbiddenException } from "@nestjs/common";


export const UnauthorizedAccessException = new UnauthorizedException('Error.UnauthorizedAccess')
export const InvalidAccessTokenException = new UnauthorizedException('Error.InvalidAccessToken')

export const MissingAccessTokenException = new UnauthorizedException('Error.MissingAccessToken')
export const ForbiddenExceptionRpc = new ForbiddenException()

