# Fastify API

A Fastify backend API for fetching user and invoice data.

## Project Setup

### Install Node.js and NPM

Before setting up Fastify API, make sure you have Node.js and NPM installed on your machine. You can download and install them from the official website: [Node.js](https://nodejs.org/).

### Clone Project from Github

At this stage, you want to clone the github project on your local machine, follow the following steps:

- Open terminal on your machine and change directory to where you want to store the project.

```
cd to-project-dir
```

- From the project directory, execute the following github clone command in terminal:

```
git@github.com:xtremeonecoder/Fastify-Api.git
```

### Install Application Packages

In the same terminal, install all the packages of the application using following command.

```
npm install
```

### Start the API Application

In the same terminal, start the API server using the following command.

```
npm start
```

It will start the API server on port: 3000, please open your favorite API client, e.g. Postman, and test all the available API endpoints.

### Available API Endpoints

**User Endpoints:**

- [http://localhost:3000/api/user/:userId](http://localhost:3000/api/user/:userId)
  - Description: Fetches user information.
  - Method: GET
  - Request Params:
    - userId: number
  - Response Object: JSON object contains user's information.
- [http://localhost:3000/api/user/:userId/avatar](http://localhost:3000/api/user/:userId/avatar)
  - Description: Fetches user avatar base64 image data and saves in filesystem and cache.
  - Method: GET
  - Request Params:
    - userId: number
  - Response Object: JSON object contains user's avatar base64 image data.
- [http://localhost:3000/api/user/:userId/avatar](http://localhost:3000/api/user/:userId/avatar)
  - Description: Deletes user's avatar image from filesystem and cache.
  - Method: DELETE
  - Request Params:
    - userId: number
  - Response Object: JSON object contains deletion success message.

**Invoice Endpoints:**

- [http://localhost:3000/status/invoice](http://localhost:3000/status/invoice)
  - Description: Fetches invoice information for given invoiceId.
  - Method: POST
  - Request Body:
    - invoiceId: string
  - Response Object: JSON object contains invoice information for given invoiceId.
- [http://localhost:3000/status/eth/invoice](http://localhost:3000/status/eth/invoice)
  - Description: Fetches invoice rate and amount for Ethereum.
  - Method: POST
  - Request Body:
    - invoiceId: string
  - Response Object: JSON object contains invoice rate and amount for Ethereum.
