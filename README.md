# Northcoders News API

## Setup environment variables

After cloning the reop you will need to two .env files at the rool level for your project: .env.test and .env.development. In .env.test, add PGDATABASE=<database_name_here_test> and in .env.development add PGDATABASE<database_name_here>

These will automatically be ignored in the .gitignore file

## Installation

## REST APIs

### Index

1. GET /api/topics
2. GET /api/articlse
3. GET /api/articles/:article_id
4. GET /api/articles/:article_id/comments
5. PATCH /api/articles/:article_id
6. POST /api/articles/:article_id/comments
7. GET /api/users
8. DELETE /api/comments/:comment_id
