import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth.gateway.controller';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import {
  ADMIN_SERVICE,
  AUTH_SERVICE,
  BOOKING_SERVICE,
  MANAGER_SERVICE,
  MEDIA_SERVICE,
  PAYMENT_SERVICE,
  PROVIDER_SERVICE,
  SERVICE_SERVICE,
  STAFF_SERVICE,
  USER_SERVICE,
} from 'libs/common/src/constants/service-name.constant';
import { ManagerGatewayController } from './manager.gateway.controller';
import { MediaGatewayController } from './media.gateway.controller';
import { APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'libs/common/src/pipes/custom-zod-validation.pipe';
import { ManageServicesGatewayController } from './provider-gateway-controller/manage-services-controller';
import { ManageStaffGatewayController } from './provider-gateway-controller/manager-staffs-controller';
import { ServiceGatewayController } from './service.gateway.controller';
import { CategoryGatewayController } from './category.gateway.controller';
import { UserGatewayController } from './user.gateway.controller';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { BookingsGatewayController } from './booking.gateway.controller';
import { PublicGatewayController } from './public.gateway.controller';
import { ManageBookingsGatewayController } from './provider-gateway-controller/manage-bookings-controller';
import { StaffGatewayController } from './staff.gateway.controller';
import { AdminGatewayController } from './admin.gateway.controller';
import { PaymentGatewayController } from './payment.gateway.controller';
import { ManageFundingGatewayController } from './provider-gateway-controller/manage-funding-controller';
import { ChatGateway } from './chat.gateway.controller';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.TCP_PORT || '3002'),
        },
      },
      {
        name: MANAGER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.MANAGER_HOST || 'localhost',
          port: parseInt(process.env.MANAGER_TCP_PORT || '3004'),
        },
      },
      {
        name: MEDIA_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.MEDIA_HOST || 'localhost',
          port: parseInt(process.env.MEDIA_TCP_PORT || '3006'),
        },
      },
      {
        name: PROVIDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.PROVIDER_HOST || 'localhost',
          port: parseInt(process.env.PROVIDER_TCP_PORT || '3008'),
        },
      },
      {
        name: SERVICE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.SERVICE_HOST || 'localhost',
          port: parseInt(process.env.SERVICE_TCP_PORT || '3010'),
        },
      },
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.USER_HOST || 'localhost',
          port: parseInt(process.env.USER_TCP_PORT || '4000'),
        },
      },
      {
        name: BOOKING_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.BOOKING_HOST || 'localhost',
          port: parseInt(process.env.BOOKING_TCP_PORT || '3012'),
        },
      },
    ]),
  ],
  controllers: [
    AuthGatewayController,
    ManagerGatewayController,
    MediaGatewayController,
    ManageServicesGatewayController,
    ManageStaffGatewayController,
    ServiceGatewayController,
    CategoryGatewayController,
    UserGatewayController,
    BookingsGatewayController,
    PublicGatewayController,
    ManageBookingsGatewayController,
    StaffGatewayController,
    AdminGatewayController,
    PaymentGatewayController,
    ManageFundingGatewayController,
  ],
  providers: [
    ChatGateway,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: USER_SERVICE,
      useFactory: () => {
        const host = process.env.USER_HOST || 'localhost';
        const port = parseInt(process.env.USER_TCP_PORT || '4000');
        return new RawTcpClientService(host, port);
      },
    },
    {
      provide: STAFF_SERVICE,
      useFactory: () => {
        const host = process.env.STAFF_HOST || 'localhost';
        const port = parseInt(process.env.STAFF_TCP_PORT || '4002');
        return new RawTcpClientService(host, port);
      },
    },
    {
      provide: ADMIN_SERVICE,
      useFactory: () => {
        const host = process.env.ADMIN_POD_HOST || 'localhost';
        const port = parseInt(process.env.ADMIN_POD_TCP_PORT || '4003');
        return new RawTcpClientService(host, port);
      },
    },
    {
      provide: PAYMENT_SERVICE,
      useFactory: () => {
        const host = process.env.PAYMENT_HOST || 'localhost';
        const port = parseInt(process.env.PAYMENT_TCP_PORT || '4001');
        return new RawTcpClientService(host, port);
      },
    },
  ],
})
export class AppModule {}
