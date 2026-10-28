# Tourney — Angular Frontend

The current web interface for Tourney, a foosball tournament management platform. Built with Angular 21, TypeScript, RxJS, and PrimeNG.

See the [project overview](../README.md) for the backend, database, repository layout, and contributor information.

## Prerequisites

- Node.js and npm compatible with the Angular CLI version resolved in `package-lock.json`.
- A running Tourney backend and configured database for authentication and tournament data.

## Install and run

Run these commands inside `TourneyNG-2.0/`:

```sh
npm ci
npm start
```

Open the local URL reported by the Angular development server. The application is configured with a `/TourneyBE/` base path.

`npm start` enables the development proxy in `proxy.conf.json`. It forwards `/TourneyBE/api` requests to `http://127.0.0.1:8082`. Also review `src/environments/environment.ts`, which currently sets `serverUri` to `http://localhost:8082/`; requests using an absolute backend URL are not handled by the development proxy.

Adjust these settings to match your local backend. Environment files are applied according to `angular.json`; the existence of `environment.prod.ts` alone does not enable an automatic production replacement.

## Build

```sh
npm run build
```

This runs the production build configured in `angular.json`. Deployment must serve the generated application under the configured `/TourneyBE/` base path, or use a build configuration adapted to the target location.

## Unit tests

```sh
npm test
```

The project configures Karma and Jasmine for unit tests. A suitable browser is required for browser-based test execution.

## Main areas

- Administration: tournaments, players, teams, operators, rounds, elimination stages, and playoffs.
- Presentation: tournament lists, matches, results, standings, and brackets.
- Authentication and real-time tournament views.
