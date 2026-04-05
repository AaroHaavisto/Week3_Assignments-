# Validation Rules

## Auth
- `POST /api/v1/auth/login`
  - `username`: required, trimmed, length 1-50
  - `password`: required, trimmed, length 1-100

## Users
- `POST /api/v1/users`
  - `name`: required, trimmed, length 2-100, escaped
  - `username`: required, trimmed, length 3-50, escaped
  - `email`: required, valid email, normalized
  - `password`: required, trimmed, length 6-100
  - `role`: optional, must be `user` or `admin`
- `PUT /api/v1/users/:id`
  - `id`: required param, integer >= 1
  - `name`: required, trimmed, length 2-100, escaped
  - `username`: required, trimmed, length 3-50, escaped
  - `email`: required, valid email, normalized
  - `role`: optional, must be `user` or `admin`

## Cats
- `GET /api/v1/cats/:id`
  - `id`: required param, integer >= 1
- `GET /api/v1/cats/user/:userId`
  - `userId`: required param, integer >= 1
- `POST /api/v1/cats`
  - `cat_name`: required, trimmed, length 2-100, escaped
  - `birthdate`: required, valid ISO-8601 date
  - `weight`: required, float between 0 and 100
  - `owner`: required, integer >= 1
- `PUT /api/v1/cats/:id`
  - `id`: required param, integer >= 1
  - `name`: required, trimmed, length 2-100, escaped
  - `birthdate`: required, valid ISO-8601 date
  - `weight`: required, float between 0 and 100
  - `owner`: required, integer >= 1

## File Uploads
- `POST /api/v1/cats` accepts only images and videos
- Maximum file size is 10 MB
