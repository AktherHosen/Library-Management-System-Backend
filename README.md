# Library Management System Backend

A Library Management System built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**. This API allows users to manage books, borrow them, and retrieve summaries of borrowed books using aggregation.

## Features

- Create, Read, Update, Delete (CRUD) operations for books
- Borrow books with availability enforcement
- Aggregation summary of borrowed books
- Schema validation using Mongoose and Zod
- Static methods and middleware (pre and post) in Mongoose
- Filtering, sorting, and limit support for listing books

## Folder Structure

```
library-management-system-backend/
├── src/
│ ├── app/
│ │ ├── models/
│ │ │ ├── books.model.ts
│ │ │ └── borrow.model.ts
│ │ ├── controllers/
│ │ │ ├── books.controller.ts
│ │ │ └── borrow.controller.ts
│ │ ├── interfaces/
│ │ │ ├── book.interfaces.ts
│ │ │ └── borrow.interfaces.ts
│ ├── app.ts
│ └── server.ts
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## API Reference

#### Create book

```http
  POST /api/books
```

| Field         | Type      | Required | Description                                                                            |
| ------------- | --------- | -------- | -------------------------------------------------------------------------------------- |
| `title`       | `string`  | Yes      | The title of the book                                                                  |
| `author`      | `string`  | Yes      | The author of the book                                                                 |
| `genre`       | `string`  | Yes      | Must be one of: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY` |
| `isbn`        | `string`  | Yes      | Must be unique. The International Standard Book Number                                 |
| `description` | `string`  | No       | Optional description or summary of the book                                            |
| `copies`      | `number`  | Yes      | Total number of copies available (must be a non-negative integer)                      |
| `available`   | `boolean` | No       | Defaults to `true` if not provided                                                     |

#### Get all books

```http
  GET /api/books
```

| Parameter | Type     | Required | Description                                            |
| --------- | -------- | -------- | ------------------------------------------------------ |
| `filter`  | `string` | No       | Filter books by genre (`FICTION`, `FANTASY`, etc.)     |
| `sortBy`  | `string` | No       | Field to sort by (e.g., `createdAt`, `title`)          |
| `sort`    | `string` | No       | Sort order: `asc` or `desc`                            |
| `limit`   | `number` | No       | Limit the number of results returned (default is `10`) |

#### Get single book

```http
  GET /api/books/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of book to fetch |

#### Update book

```http
  PATCH /api/books/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of book to fetch |

#### Delete book

```http
  DELETE /api/books/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of book to fetch |

#### Borrow a Book

```http
POST /api/borrow
```

| Field      | Type       | Required | Description                              |
| ---------- | ---------- | -------- | ---------------------------------------- |
| `book`     | `ObjectId` | Yes      | MongoDB ID of the book to borrow         |
| `quantity` | `number`   | Yes      | Number of copies to borrow (must be > 0) |
| `dueDate`  | `date`     | Yes      | Due date for returning the book          |

#### Borrowed Books Summary

```http
GET /api/borrow
```

## Tech Stack

- Node
- Express
- MongoDB
- Mongoose
- TypeScript
- Aggregation Pipleline
- Zod Validation

## Installation

#### Clone repository

```
git clone https://github.com/AktherHosen/Library-Management-System-Backend.git
```

#### Navigate to the folder

```
cd Library-Management-System-Backend
```

#### Install Dependencies

```bash
  npm install
```

### ENV Configurations

- Create an .env file in your root directory and add these configurations

```
DATABASE_NAME=<your_mongodb_database_name>
DATABASE_PASSWORD=<your_mongodb_database_password>
```

### Start Application

```
npm run start:dev
```
