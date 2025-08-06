import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { PrismaService } from '../services/prisma.service';
import { AccessTokenPayload } from '../types/jwt.type';
import { HTTPMethod } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
    private readonly logger = new Logger(WsAccessTokenGuard.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly prismaService: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();

        const token = client.handshake?.auth?.token;

        if (!token) {
            this.logger.warn('Socket connection missing access token');
            throw new WsException({
                message: 'Error.MissingAccessToken',
                code: 401,
            });
        }

        let decoded: AccessTokenPayload;
        try {
            decoded = await this.tokenService.verifyAccessToken(token);
        } catch (e) {
            console.log(e);

            this.logger.warn('Invalid access token during socket handshake');
            throw new WsException({
                message: 'Error.InvalidAccessToken',
                code: 401,
            });
        }

        client.data.user = decoded;
        console.log(decoded);

        await this.validateUserPermission(decoded, context);

        return true;
    }

    private async validateUserPermission(
        decodedAccessToken: AccessTokenPayload,
        context: ExecutionContext,
    ): Promise<void> {
        const handler = context.getHandler();
        const eventName = Reflect.getMetadata('message', handler);

        const path = `/socket/${eventName || 'unknown'}`;
        const method = HTTPMethod.POST;
        console.log(method, path);

        const roleIds = decodedAccessToken.roles.map((r) => r.id);
        const roles = await this.prismaService.role.findMany({
            where: { id: { in: roleIds }, deletedAt: null },
            include: {
                permissions: {
                    where: {
                        path,
                        method,
                        deletedAt: null,
                    },
                },
            },
        });

        const permissions = roles.flatMap((r) => r.permissions)
        console.log(roles);
        console.log(permissions);


        if (!permissions.length) {
            this.logger.warn(
                `Socket event "${eventName}" blocked due to lack of permission`,
            );
            throw new WsException({
                message: 'Error.Forbidden',
                code: 403,
            });
        }
    }
}
