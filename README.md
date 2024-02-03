## Oidc service

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
export PORT=4000
export REDIS_URL=redis://:devel@127.0.0.1:53113
export PG_URL=postgres://postgres:@127.0.0.1:53111/devdb?schema=public
npm run start
```
