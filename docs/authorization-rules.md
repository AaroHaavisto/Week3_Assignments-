# Authorization rules

## Authentication
- `POST /api/v1/auth/login` returns JWT token on valid username/password.
- `GET /api/v1/auth/me` requires `Authorization: Bearer <token>` and returns decoded user info.

## Cats
- `PUT /api/v1/cats/:id` requires JWT.
- `DELETE /api/v1/cats/:id` requires JWT.
- Role `admin` can update/delete any cat.
- Role `user` can update/delete only cats where `cat.owner = token.user_id`.

## Users
- `PUT /api/v1/users/:id` requires JWT.
- `DELETE /api/v1/users/:id` requires JWT.
- Role `admin` can update/delete any user.
- Role `user` can update/delete only own user record (`token.user_id === :id`).
