import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export const ServiceProviderNotFoundException = new NotFoundException([
  { message: 'Service provider not found', path: ['id'] },
]);

export const MissingProviderIdException = new BadRequestException([
  { message: 'Provider ID is missing', path: ['providerId'] },
]);

export const ProviderNotVerifiedException = new ForbiddenException([
  { message: 'Service provider has not been verified', path: ['providerId'] },
]);
