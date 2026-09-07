<p align="center"><img src="./panel/assets/logo.svg" alt="Wepan logo" height=128 width=128></p>
<h1 align="center">WeebPanel</h1><p align="center">Wepan is our alternative to forgepanel's style.</p>

## Panel Work
The panel will support multiple user logins and has two main access states:
### No Access
Users without access can:
- See basic bot information
- See limited panel information
- Cannot access or modify protected resources
### Access
Users with access can:
- View panel resources based on their permissions
- Access specific features depending on their assigned permissions
- Perform actions allowed by their permissions
  

When opening the panel, users will be asked whether they want to log in.

The login key is sent to:

```text
/api/login
````

If the key is valid, the panel will use it for subsequent API requests.

All other:

```text
/api/*
```

requests will include the login key so the backend can authenticate and authorize the request.

## Backend Work

The backend is responsible for:

* Handling authentication
* Validating login keys
* Managing users and permissions
* Serving panel API endpoints
* Authorizing requests based on user permissions
* Providing bot/panel information to the frontend

### API

```text
POST /api/login
```

Authenticates a user using their login key.

```text
/api/*
```

Protected endpoints used by the panel.

## Extension Work

The ForgeScript extension is responsible for:

* Starting the WeebPanel backend
* Connecting the panel to the running bot
* Providing bot information to the backend
* Handling panel-related functionality