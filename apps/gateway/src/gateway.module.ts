import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth.gateway.controller';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { ADMIN_SERVICE, AUTH_SERVICE, BOOKING_SERVICE, MANAGER_SERVICE, MEDIA_SERVICE, PROVIDER_SERVICE, SERVICE_SERVICE, STAFF_SERVICE, USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
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

@Module({
  imports: [CommonModule, ConfigModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3002'),
        },
      }, {
        name: MANAGER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3004'),
        },
      },
      {
        name: MEDIA_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3006'),
        },
      },
      {
        name: PROVIDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3008'),
        },
      },
      {
        name: SERVICE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3010'),
        },
      },
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('4000'),
        },
      },
      {
        name: BOOKING_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: parseInt('3012'),
        },
      }
    ]),
  ],
  controllers: [AuthGatewayController, ManagerGatewayController, MediaGatewayController, ManageServicesGatewayController, ManageStaffGatewayController, ServiceGatewayController, CategoryGatewayController, UserGatewayController, BookingsGatewayController, PublicGatewayController, ManageBookingsGatewayController, StaffGatewayController, AdminGatewayController],
  providers: [{
    provide: APP_PIPE,
    useClass: CustomZodValidationPipe,

  }, {
    provide: USER_SERVICE,
    useFactory: () => {
      const host = 'localhost';
      const port = parseInt('4000');
      return new RawTcpClientService(host, port);
    },
  }, {
    provide: STAFF_SERVICE,
    useFactory: () => {
      const host = 'localhost';
      const port = parseInt('4002');
      return new RawTcpClientService(host, port);
    },
  },
  {
    provide: ADMIN_SERVICE,
    useFactory: () => {
      const host = 'localhost';
      const port = parseInt('4003');
      return new RawTcpClientService(host, port);
    },
  }]
})
export class AppModule { }
