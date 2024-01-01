# jwt example
 
# JWT Example
This is a simple example project demonstrating how to use JSON Web Tokens (JWT) for authentication in a Node.js application using ExpressJS.

## Overview
This project shows:

- How to generate a JWT using a secret key
- How to generate a refresh token
- How to regenerate a JWT using a refresh token
- How to validate a JWT on protected routes
- How to get user information from a decoded JWT

The app has two main routes:
- Server
- GET /posts - Validates the JWT from the Authorization header and returns a message if valid

- POST /token - if the request body contains a token, verify it
- POST /login - assuming the user is already logged in, generate a JWT and a refresh token

## Usage
- Consider using Postman and VSCode "REST Client Extension"
- Review the `requests.rest` file for http requests used
- create a `.env` with a `ACCESS_TOKEN_SECRET` and a `REFRESH_TOKEN_SECRET`, you can do this manually
- run the 2 servers using the following: `npm run devStart` and `npm run authStart` (uses NodeMon, you can change this in package.json)
- Make a POST request to /login, get the refresh and asset token
- Make a GET request to /posts with the refresh token in the Authorization header to /posts
- Make a POST request to /token to generate a new asset token if the asset token expires