## Api service

### Get started

#### Install dependencies
```shell
npm install
```

#### Build project
```shell
npm run build
```

#### Run
```shell
export PORT=4001
export OIDC_PROVIDER_URL=http://localhost:4000/oidc/jwks
export PG_URL=postgres://postgres:postgres@127.0.0.1:53111/devdb?schema=public
npm run start
```
