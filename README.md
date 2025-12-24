# Keenan Travel & Tours - Backend (Project OTA)

## Overview
This repository contains the NestJS backend API for the Keenan Travel & Tours B2B platform. It provides authentication, flight search and booking workflows, agent/admin operations, ticketing/void/refund/reissue flows, and supporting services like file uploads, email notifications, and reporting.

The API runs on port `8080` and exposes Swagger documentation at `/jakuma`.

## Tech Stack
- Node.js 18.x
- NestJS 10
- TypeORM + MySQL
- JWT authentication
- Swagger/OpenAPI
- Nodemailer (SMTP)
- DigitalOcean Spaces (S3-compatible storage)

## Project Structure
- `src/main.ts` - App bootstrap, global middleware, Swagger setup.
- `src/app.module.ts` - Root module wiring.
- `src/database/` - TypeORM connection setup.
- `src/api/` - Feature modules and HTTP controllers.
- `src/mail/` - Email service (OTP, signup, deposit, booking confirmations).
- `src/paymentgateway/` - Payment gateway module stub.
- `dist/` - Compiled output (production build).

## API Modules (High-Level)
Key API modules are grouped under `src/api/`:
- `auth` - Agent/admin login, OTP verification, password reset.
- `agent` - Agent profile and management.
- `admin` - Admin tools including role/control and markup configuration.
- `flight` - Flight search, revalidation, fare rules, booking and retrieval.
- `booking` - Booking lifecycle and storage.
- `ticketing`, `void`, `refund`, `reissue` - Post-booking workflows.
- `passenger`, `traveller` - Passenger data management.
- `airlines`, `airports` - Reference data.
- `currency`, `banklist`, `deposit` - Finance and wallet operations.
- `promotion`, `groupfare` - Pricing/discount features.
- `report`, `activitylog`, `searchhistory` - Analytics/auditing.
- `notes`, `notice` - Internal notes and notifications.
- `upload` - File uploads (DigitalOcean Spaces).
- `staff` - Staff management.

## Environment Variables
Create a `.env` file in the project root. Do not commit secrets.

Required keys (values shown as placeholders):
```env
JWT_SECREATE_KEY=your_jwt_secret
DATABASE_URL=mysql://user:pass@host:3306/dbname

# DigitalOcean Spaces
SPACES_ACCESS_KEY=your_spaces_access_key
SPACES_SECRET_KEY=your_spaces_secret_key
BUCKET_NAME=keenan-b2b
SPACES_ENDPOINT=sgp1.digitaloceanspaces.com
CDN_SPACES=https://<bucket>.<region>.cdn.digitaloceanspaces.com
ALLOW_IMAGE_SIZE=3000000

# Mail Service
EMAIL_HOST=smtp.yourmailhost.com
EMAIL_USERNAME=noreply@yourdomain.com
EMAIL_PASSWORD=your_password

# External Flight Providers
AH_USERID=your_alhind_user
AH_PASSWORD=your_alhind_password
AH_ENDPOINT_SEARCH=https://your-endpoint/search.php

# Sabre (required for air search/booking)
AGENCY_NAME=PROJECTOTA
SABRE_PCC_COUNTRY=BD
SABRE_CITY_NAME=DHAKA
SABRE_AGENCY_STNO=DHAKA
SABRE_POSTAL_CODE=1229
SABRE_STATE_CODE=DAC
SABRE_ID=your_sabre_id
SABRE_PASSWORD=your_sabre_password
SABRE_PCC=your_sabre_pcc
SABRE_PTR=your_sabre_ptr
SABRE_LNIATA=your_sabre_lniata
SABRE_HOSTID=your_sabre_hostid
SABRE_BASE_URL=https://api.platform.sabre.com
SABRE_AUTH_ENDPOINT=https://api.platform.sabre.com/v2/auth/token
SABRE_AIRSEARCH_ENDPOINT=https://api.platform.sabre.com/v4/offers/shop
SABRE_AIRPRICE_ENDPOINT=https://api.platform.sabre.com/v4/shop/flights/revalidate
SABRE_AIRBOOKING_ENDPOINT=https://api.platform.sabre.com/v2.4.0/passenger/records?mode=create
SABRE_AIRCANCEL_ENDPOINT=https://api.platform.sabre.com/v1/trip/orders/cancelBooking
SABRE_AIRRETRIEVE_ENDPOINT=https://api.platform.sabre.com/v1/trip/orders/getBooking
SABRE_AIRTICKETING_ENDPOINT=https://api.cert.platform.sabre.com/v1.3.0/air/ticket
SABRE_CHECK_AIRTICKETING_ENDPOINT=https://api.cert.platform.sabre.com/v1/trip/orders/checkFlightTickets
SABRE_AIRVOID_ENDPOINT=https://api.cert.platform.sabre.com/v1/trip/orders/cancelBooking
SABRE_AIRSEATS_ENDPOINT=https://api.cert.platform.sabre.com/v1/offers/getseats
SABRE_WEBSERVICE_ENDPOINT=https://webservices.cert.platform.sabre.com
```

## Scripts
```bash
npm run start        # Start server
npm run start:dev    # Start with watch mode
npm run build        # Build to dist/
npm run start:prod   # Run production build
npm run lint         # Lint
npm run test         # Unit tests
```

## Local Development
```bash
npm install
cp .env.example .env  # If you add one; otherwise create .env manually
npm run start:dev
```

## Swagger / OpenAPI
When the server is running, visit:
- `http://localhost:8080/jakuma`

Use the Bearer token input in Swagger to authorize protected endpoints.

## Docker
The `Dockerfile` builds and runs the API on port `8080`:
```bash
docker build -t keenan-backend .
docker run -p 8080:8080 --env-file .env keenan-backend
```

## Notes
- Database schema is managed via TypeORM entities in feature modules.
- `synchronize` is disabled; use migrations or manual DB changes.
- Credentials in `.env` are sensitive; keep them out of version control.
