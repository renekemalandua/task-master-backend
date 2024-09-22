<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
### API RESTful com NestJS, TypeScript, JWT e SOLID

## Description

<p> RESTful API with NestJS, TypeScript, JWT, and SOLID - CRUD for Users, Tasks, and Roles
This repository contains a RESTful API built with NestJS and TypeScript, following SOLID principles. The API implements complete CRUD functionality for users, tasks, and roles (permissions), with routes protected by middleware for authentication and authorization using JWT (JSON Web Tokens).</p>

## Main Features:
<ul>
  <li>User CRUD: Create, read, update, and delete users.</li>
  <li>Task CRUD: Manage tasks linked to users.</li>
  <li>Role CRUD: Define and assign access permissions.</li>
  <li>Authentication and Authorization: Use JWT to authenticate and protect sensitive routes.</li>
  <li>Role-based Permissions: Only users with the appropriate permissions can access specific routes and perform operations.</li>
</ul>

## Technologies:
<ul>
 <li>NestJS: Framework for building scalable applications in Node.js.</li>
 <li>TypeScript: A superset of JavaScript that adds static typing.</li>
 <li>JWT: Implementation of authentication and authorization.</li>
 <li>SOLID Principles: Modular and scalable architecture, facilitating maintenance and extension of the application.</li>
</ul>

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
