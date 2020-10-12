# Dev-proxy

The app is not always served from host's the root,
it can be served under any sub-directory it is deployed at.

Use this nginx server to simulate this behavior for development and testing.

### Note: This is only a wrapper, the server/dev-server should be running.

Start the server

```
npm run start:server
OR
npm start
```

Start the proxy

```
npm run start:proxy
```

The app will be served under localhost:3005/some/subdir

To get the proxy logs use

```
docker logs -f app-server
```
