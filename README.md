# Cine-Byte API


## 1. Project Context

A RESTful API backend for Cine-Byte — a movie discovery and review platform. This serves as the backend service for the Cine-Byte application previously built in JSCRIPT 320, which currently uses Firebase as its data source. This project rebuilds that backend using Node.js, Express, and MongoDB.

The live frontend application can be found at: https://movie-night-generator.web.app

---

## 2. Problem It Solves

Movie enthusiasts need a way to discover movies, write reviews, and see community ratings. The API provides authenticated access to a movie catalog where users can contribute reviews and ratings while admins manage the movie database. It also provides aggregated statistics like average ratings by genre and top rated films.

---

## 3. Technical Components

### Data Models

> - User
> - Movie
> - Review

---

### Routes

**Auth**
```
POST /auth/signup           create a new user account
POST /auth/login            authenticate and return JWT token
PUT  /auth/password         change password (authenticated)
```

**Movies**
```
GET    /movies              get all movies (authenticated)
GET    /movies/:id          get one movie with its reviews (authenticated)
POST   /movies              create a movie (admin only)
PUT    /movies/:id          update a movie (admin only)
DELETE /movies/:id          delete a movie (admin only)
```

**Reviews**
```
GET    /reviews             get all reviews by the logged in user
POST   /reviews             create a review (authenticated)
PUT    /reviews/:id         update own review (authenticated)
DELETE /reviews/:id         delete own review (authenticated)
```

**Stats**
```
GET    /stats/top-rated     top rated movies using aggregation pipeline
GET    /stats/by-genre      average rating per genre using aggregation pipeline
GET    /stats/most-reviewed  most reviewed movies using aggregation pipeline
```

---

### Middleware

| Middleware | Purpose |
|---|---|
| `isAuthorized` | Verifies JWT token on all protected routes |
| `isAdmin` | Checks admin role for restricted movie management routes |


---

### DAOs (Data Access Objects)

| DAO | Methods |
|---|---|
| `userDao` | `createUser`, `getUser`, `updatePassword` |
| `movieDao` | `getAll`, `getById`, `create`, `update`, `remove` |
| `reviewDao` | `getByUser`, `getByMovie`, `create`, `update`, `remove` |

---


## 4. Project Requirements

| Requirement | How It's Met |
|---|---|
| Authentication | JWT based signup and login with bcrypt password hashing — passwords never stored in plain text |
| Authorization | Admin role required for movie management, user role for reviews, owner check for modifying own reviews |
| Middleware | `isAuthorized` for authentication, `isAdmin` for role based access, `isOwner` for data ownership |
| Multiple models | User, Movie, and Review models with relationships via ObjectId references |
| Advanced MongoDB | Aggregation pipeline for stats routes — average ratings, top rated movies, most reviewed |
| DAOs | Separate DAO layer isolates all database operations from route handlers |
| RESTful routes | Full CRUD for movies and reviews following REST conventions |

---

## 5. Weekly Timeline

| Dates | Goals |
|---|---|
| May 13 - May 16 | Project setup, User model, auth routes (signup, login, change password), isAuthorized middleware |
| May 17 - May 21 | Movie model and CRUD routes, isAdmin middleware, seed movie data from OMDB API |
| May 22 - May 25 | Review model and routes, isOwner middleware |
| May 26 - May 28 | Stats routes with aggregation pipelines (top rated, by genre, most reviewed) |
| May 29 - May 31 | Testing, code cleanup, Postman collection, mongosh demo queries, presentation preparation |
| June 2 | **Presentation** |

---


