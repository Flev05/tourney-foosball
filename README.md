# Tourney — Foosball Tournament Manager

A full-stack web platform for organizing and managing foosball tournaments, from player and team administration to rounds, match results, and standings.

[Live platform](https://tourney.erebus-soft.com/TourneyBE/#/) · [Frontend setup](TourneyNG-2.0/README.md)

## Features

- Manage tournaments, players, teams, and tournament operators.
- Organize rounds, elimination stages, and playoffs.
- View match results, standings, and tournament brackets.
- Follow tournament activity through dedicated presentation and real-time views.
- Use separate administration and spectator views.

## Technology

| Layer | Technologies |
| --- | --- |
| Current frontend | Angular 21, TypeScript, RxJS, PrimeNG, PrimeFlex |
| Backend | Java 21, Jakarta APIs, Hibernate, Maven |
| Database | PostgreSQL |
| Application server | WildFly; backend packaged as a WAR |

Versions above reflect the current source configuration. Local runtime and database setup are required to run the complete platform.

## Repository layout

```text
Database/         Database creation, schema, and data scripts
TourneyBE/        Java backend and web application packaging
TourneyNG-2.0/    Current Angular frontend
TourneyNG/        Earlier frontend source
examples/         Application server examples
```

## Getting started

### Frontend

From the repository root:

```sh
cd TourneyNG-2.0
npm ci
npm start
```

Use a Node.js version supported by the Angular CLI version in the lockfile. See the [frontend README](TourneyNG-2.0/README.md) for configuration, build, and test commands.

The frontend requires a running backend for authentication and tournament data. Starting the Angular development server alone does not start the complete platform.

### Backend and database

1. Install JDK 21, Maven, PostgreSQL, and a compatible WildFly server.
2. Review the scripts in `Database/Tourney/` and adapt database names, tablespace paths, and access settings to a local development environment before executing them. Existing database setup notes are in [Database/Tourney/README.txt](Database/Tourney/README.txt).
3. Configure the PostgreSQL JDBC driver and a WildFly datasource named `java:/TourneyDS`, as referenced by `TourneyBE/src/main/resources/META-INF/persistence.xml`.
4. Build the backend from `TourneyBE/` with `mvn clean package`, and deploy the resulting `target/TourneyBE.war` to the configured server.
5. Align the frontend API configuration with the local backend. The current frontend configuration references port `8082` and the `/TourneyBE/` context.

Server and database provisioning are environment-specific; this repository does not currently provide a single-command setup for the full stack.

## Development and repository synchronization

The shared project is hosted on [Bitbucket](https://bitbucket.org/lucianomartino/calciobalilla), with a corresponding [GitHub repository](https://github.com/Flev05/tourney-foosball). The current development branch is `develop`.

For a local clone configured with `origin` pointing to Bitbucket and `github` pointing to GitHub, start work with a clean working tree and update the branch:

```sh
git switch develop
git pull --ff-only origin develop
```

After reviewing and committing changes, publish them to both repositories:

```sh
git push origin develop
git push github develop
```

Run each command only after the preceding command succeeds. If a pull or push is rejected, reconcile the branch history before retrying. These commands synchronize `develop`; other branches and tags require their own pushes. The two hosting services do not synchronize automatically.

## Contributors

Tourney is a collaborative project developed and maintained by its contributors. The repository retains the project's development history and author attribution.

See the commit history for individual contributions across the frontend, backend, and database.
