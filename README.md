# OAuth 2.1 implementation sandbox  🔐

This repository is an object lesson of an [OAuth 2.1](https://oauth.net/2/) protocol integration on a basic **Fastify API**. I made it for learning purposes, so feel free
to contribute ! 🙃

# Install it

To start, just clone this repository and then use:

```bash
yarn install # or using pnpm: pnpm install
```

Before starting the node server, be sure to have a `.env` file matching `.env.example`. (I will come back after on the specific values to setup in it)

Then just run the following start command:

```bash
yarn dev # or using pnpm: pnpm dev
```

The auth server is by default listening on port 3000 </br>

# Try it

</br>

Try it yourself with this postman libray: [Insert button here]

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

# And what about 2.1 ??? 🧐
