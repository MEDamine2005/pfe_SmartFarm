# Smart Farm API

Laravel API backend for the Smart Farm React frontend.

## Setup

```bash
cd backend
composer install
```

Create the MySQL database:

```sql
CREATE DATABASE smart_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env` if your MySQL credentials are different:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=smart_farm
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed demo users/data:

```bash
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Demo accounts:

- farmer@smartfarm.local / 1234
- admin@smartfarm.local / 1234

## Auth

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@smartfarm.local",
  "password": "1234"
}
```

Use the returned token for protected routes:

```http
Authorization: Bearer YOUR_TOKEN
```

## Main Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/sensors`
- `GET /api/sensors/history?range=24h|7d|30d`
- `POST /api/sensors`
- `GET /api/weather`
- `POST /api/weather`
- `GET /api/irrigation`
- `POST /api/irrigation`
- `GET /api/irrigation/events`
- `GET /api/alerts`
- `PATCH /api/alerts/{alert}/read`
- `DELETE /api/alerts/{alert}`
- `GET /api/chat`
- `POST /api/chat`
- `GET /api/admin/reports`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{user}`
- `GET /api/admin/iot/devices`
- `PATCH /api/admin/iot/devices/{device}`
