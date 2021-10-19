# Basic-Auth 🔐

Basic-Auth is an object lesson of an [OAuth 2.0](https://oauth.net/) protocol integration on a very basic Node.JS API. I made it for learning purposes, so feel free
to tell me anything that can improve this setup ! 🙃

# Install it

To start, just clone this repository and then use:

```bash
yarn install # or using npm: npm install
```

Before starting the node server, be sure to have a `.env` file containing at least the following code:

```bash
secretKey=<A RANDOM SECRET KEY OF YOUR CHOICE>
```

Then just run the following start command:

```bash
yarn start # or using npm: npm start
```

The auth server is by default listening on port 4000 </br>
The Resource server is by default listening on port 3000

# Try it

You can now try the api routes using this postman collection   ⬇️

</br>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/13815486-9b79f65f-be11-4928-94e1-90c902579f65?action=collection%2Ffork&collection-url=entityId%3D13815486-9b79f65f-be11-4928-94e1-90c902579f65%26entityType%3Dcollection%26workspaceId%3D71afb205-34e7-4c58-9c00-f3cc105b0da0)

</br>

| Method | Url | Content | Action |
| --- | --- | --- | --- |
| POST | /api/auth/signup | name, password | Register a new user |
| POST | /api/auth/login | name, password | Login and return access & refresh tokens|
| POST | /api/auth/generateAt | id, refresh token | Generate a new access token |
| GET | /api/auth/generatePk | null | Generate a new hash as private key |
| GET | /api/resources | access token as Bearer token | Return a protected route|


# About OAuth 2.0

I won't reinvent the wheel so I suggest you to read the [The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) from the Internet Engineering Task Force. It's maybe not the most beautiful documentation but it's by far one of the most complete and accurate.

Here's the basic protocol flow:

```
  +--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+

```
