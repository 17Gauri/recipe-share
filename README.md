# RecipeShare — Java Full Stack Project

A recipe sharing web app. Backend: Spring Boot + Spring Security (JWT) + MySQL.
Frontend: React (Vite) + React Router + Axios.

This is a starter skeleton covering the "Must-have" MVP scope:
- Signup / Login (JWT auth)
- Post a recipe (title, ingredients, steps, cook time, image URL)
- View all recipes / view single recipe
- Edit / delete your own recipe

## 1. Backend setup

Requirements: Java 17, Maven, MySQL running locally.

1. Create the database:
   ```sql
   CREATE DATABASE recipeshare;
   ```
2. Open `backend/src/main/resources/application.properties` and update:
   - `spring.datasource.username` / `spring.datasource.password` to match your MySQL setup
   - `jwt.secret` — replace with your own long random string (32+ characters) before this touches any real data
3. Run it:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080/api`.

Note: this sandbox couldn't reach Maven Central to actually build/test this for you (network is restricted here), so run `mvn spring-boot:run` on your own machine the first time to confirm it compiles cleanly. The code follows standard Spring Boot 3.2 + Spring Security 6 patterns, but double-check dependency versions in `pom.xml` still resolve if you hit issues.

## 2. Frontend setup

Requirements: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:3000` and talk to the backend at `http://localhost:8080/api`
(see `frontend/src/api/axios.js` if you need to change that base URL).

## 3. Try it out

1. Sign up for an account
2. Click "New Recipe" and publish one (use an image URL from anywhere, e.g. an Unsplash link)
3. View it on the home feed, open it, edit it, delete it

## What's intentionally left out (for the weekend MVP)

- Search / category filters
- Favorites/save
- Comments or ratings
- Real image upload (using a pasted URL instead, to save setup time)

These are good "v2" additions once the MVP works end to end — and good talking points
in an interview ("what would you add next and why").

## Folder structure

```
recipe-share/
├── backend/   (Spring Boot — Java)
└── frontend/  (React — Vite)
```
