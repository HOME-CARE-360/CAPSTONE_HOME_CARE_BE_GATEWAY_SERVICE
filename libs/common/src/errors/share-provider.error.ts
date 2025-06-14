import { ForbiddenException, NotFoundException, UnauthorizedException } from "@nestjs/common";

export const ServiceProviderNotFoundException =
    new NotFoundException([
        { message: 'Error.ServiceProviderNotFound', path: ['id'] },
    ])

export const MissingProviderIdException = new UnauthorizedException({
    message: 'Error.MissingProviderId',
    path: ['providerId'],
});

export const ProviderNotVerifiedException = new ForbiddenException({
    message: 'Error.ProviderNotVerified',
    path: ['providerId'],
});
