# OAuth 2.1 implementation sandbox  🔐

This repository is an object lesson of an [OAuth 2.1](https://oauth.net/2/) protocol integration on a basic **Fastify API**. I made it for learning purposes, so feel free
to contribute ! 🙃

## Table of Contents
* [Installation](#installation)
* [What is OAuth ?](#what-is-oauth)
* [How to use this repository ?](#how-to-use-this-repository)
* [Try it](#try-it)


## Installation

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

## What is OAuth

### OAuth 2.0 

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

### And what about 2.1 🧐

OAuth 2.1 is an in-progress effort to consolidate and simplify the most commonly used features of OAuth 2.0. You can go [here](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-10) for more details.

But the main changes are the following: 

 - The authorization code grant is extended with the functionality from PKCE (Proof-Key for Code Exchange)

 - Redirect URIs must be compared using exact string matching
 
 - The Implicit grant (response_type=token) is omitted
 
 - The Resource Owner Password Credentials grant is omitted
 
 - Bearer token usage omits the use of bearer tokens in the query string of URIs
 
 - Refresh tokens for public clients must either be sender-constrained or one-time use 

## How to use this repository

This API provides endpoints to test OAuth flow all by yourself without any front-end. The limit however is that as there is no front-end application you need to do some more steps by yourself in order to make it work. Of course in a production ready application it would'nt have been done this way. 

### Register a new user

#### 1/ Using user credentials:

  You can register a new user in two ways, first you can use the ```POST /auth/register``` route to register a user by sending an email 

#### 2/ Using a third party provider 

  For a third party provider, the register process is the same that an authentication.

### Authenticate

#### With ```grant_type="password"``` 

> ⚠️ As the 2.1 standard specifies, using the password must be avoided as much as possible

Request ```POST /auth/authenticate``` with the right email and the right password and you will be granted an access/refresh tokens duet.

#### With ```grant_type="refresh_token"```

Request ```POST /auth/authenticate``` with the ```refresh_token``` you stored from your last authentication request and you will be granted a new access/refresh tokens duet.

#### With ```grant_type="authorization_code"```

The authorization code allows you to register using a code provided by a third party solution (like Google or Github). In this example we use the provided code to access you public data on these providers api and then create an access/refresh tokens duet.

##### <ins>Using Google:</ins>
> ℹ️ You can find the documentation for Google Api using OAuth [here](https://developers.google.com/identity/protocols/oauth2/native-app)

- **Step 1:** Request ```GET /helpers/pkce``` to get your ```code_challenge``` and your ```code_verifier``` required for the [PKCE](https://www.oauth.com/oauth2-servers/pkce/) flow. 

- **Step 2:** Navigate to this url https://accounts.google.com/o/oauth2/v2/auth/oauth?scope=email&response_type=code&redirect_uri=http://localhost:3000/helpers/callback&client_id=616004699496-e8udbu373o3muhns6ca826d8hsvtski8.apps.googleusercontent.com&code_challenge_method=256&code_challenge=[YOUR_CODE_CHALLENGE] 
> ⚠️ Don't forget to set your own code_challenge generated earlier in the url

- **Step 3:** After connecting with your credentials you will be redirected to the ```GET /helpers/callback``` with your authorization code.

- **Step 4:** Request ```POST /auth/authenticate``` with the right ```grant_type```, the ```code``` you just received, and also the ```code_verifier``` and you should get a access/refresh
  tokens duet as response. 

> ⚠️ It's mandatory to use the ```code_verifier``` used to encrypt the code_challenge otherwise it cannot work.

### Access ressources

To access restricted data, just set the authorization header as a "Bearer" token corresponding to your ```refresh_token```

##### <ins>Using Github:</ins>

> ℹ️ As Github **does not support PKCE** you can ignore ```code_verifier``` and ```code_challenge```

- **Step 1:** Navigate to this url: https://github.com/login/oauth/authorize?client_id=3f2c99a3de279ba209fb](https://github.com/login/oauth/authorize?client_id=3f2c99a3de279ba209fb) where ```client_id``` refers to the client_id of the github app I've created for this exemple following [this](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

- **Step 2:** After connecting with your credentials you will be redirected to the ```GET /helpers/callback``` with your authorization code. 
(this url is set as callback url in github configuration)

- **Step 3:** Request ```POST /auth/authenticate``` with the right ```grant_type``` and the ```code``` you just received, and you should get a access/refresh tokens duet as response. 

## Try it

</br>

You can found the documentation [here](https://documenter.getpostman.com/view/13815486/2sA3BoZBfN#d77d2a56-4569-4adc-bad2-79675b67041b) 👈

or even try it yourself with this postman library:<br>
<br>
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/13815486-9b79f65f-be11-4928-94e1-90c902579f65?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D13815486-9b79f65f-be11-4928-94e1-90c902579f65%26entityType%3Dcollection%26workspaceId%3D71afb205-34e7-4c58-9c00-f3cc105b0da0#?env%5BOAuth%202.1%20sandbox%5D=W3sia2V5IjoiYWNjZXNzX3Rva2VuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJyZWZyZXNoX3Rva2VuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoic2VjcmV0Iiwic2Vzc2lvblZhbHVlIjoiIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6ImJhc2VfdXJsIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6ImxvY2FsaG9zdDozMDAwIiwic2Vzc2lvbkluZGV4IjoyfSx7ImtleSI6ImNvZGVfdmVyaWZpZXIiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiMTgyMzVlMzRmZDJjM2JlMzE1N2I3MDJhYTRiNzI0NDFlNThmOGMzYTA1YjU3ODdjMmM3MWEwMTJmYzY4MjkyMjExMTk2OTE1NzMyMDFmOGIyZjZkZDNiMDY2NTIzMjE1ODE3ZjIwYmJiODg1ZmNlMzVkM2UyN2MxYjI4ZGU2OTQiLCJzZXNzaW9uSW5kZXgiOjN9LHsia2V5IjoiY29kZV9jaGFsbGVuZ2UiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiVUFtWG9tclI3NkVxbmhwamp4QUtyMFU0Z0VkREloejdYNTAtUzhmenlkdyIsInNlc3Npb25JbmRleCI6NH0seyJrZXkiOiJjYWxsYmFja191cmwiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiL2hlbHBlcnMvY2FsbGJhY2siLCJzZXNzaW9uSW5kZXgiOjV9XQ==)

