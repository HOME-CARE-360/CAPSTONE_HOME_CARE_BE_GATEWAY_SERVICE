# Gateway service

The single HTTP entry point of Home Care 360. It authenticates the caller,
checks the role, and forwards the request to the owning service as a NestJS
message pattern over TCP. No business logic lives here.

## Route groups

15 controllers, 159 routes:

- `/admin`
- `/auth`
- `/bookings`
- `/categories`
- `/manage-bookings`
- `/manage-services`
- `/manage-staffs`
- `/managers`
- `/medias`
- `/payments`
- `/providers`
- `/publics`
- `/services`
- `/staffs`
- `/users`

Public routes live under `/publics`; everything else requires a JWT. Role
guards separate customer, provider, staff, manager and admin access.

## Run

```bash
pnpm install
pnpm start:dev
```

## Configuration

Read from the environment (names as used in the code; no values are committed):

- `ACCESS_TOKEN_EXPIRES_IN`
- `ACCESS_TOKEN_SECRET`
- `ADMIN_POD_HOST`
- `ADMIN_POD_TCP_PORT`
- `APP_NAME`
- `AUTH_HOST`
- `BOOKING_HOST`
- `BOOKING_TCP_PORT`
- `GATEWAY_HTTP_PORT`
- `GOOGLE_CLIENT_REDIRECT_URI`
- `MANAGER_HOST`
- `MANAGER_TCP_PORT`
- `MEDIA_HOST`
- `MEDIA_TCP_PORT`
- `PAYMENT_API_KEY`
- `PAYMENT_HOST`
- `PAYMENT_TCP_PORT`
- `PROVIDER_HOST`
- `PROVIDER_TCP_PORT`
- `REFRESH_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_SECRET`
- `RESEND_API_KEY`
- `S3_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `S3_ENPOINT`
- `S3_REGION`
- `SERVICE_HOST`
- `SERVICE_TCP_PORT`
- `STAFF_HOST`
- `STAFF_TCP_PORT`
- `TCP_PORT`
- `USER_HOST`
- `USER_TCP_PORT`


## Part of Home Care 360

FPT University capstone project (2024–2025), built by a team of four; backend
services by [@tientran1234](https://github.com/tientran1234). The platform
overview, architecture diagram and the list of every service live in
[CAPSTONE_HOME_CARE_BE_MICROSERVICES](https://github.com/HOME-CARE-360/CAPSTONE_HOME_CARE_BE_MICROSERVICES).
