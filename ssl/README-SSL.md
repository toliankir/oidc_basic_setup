# SSL

Local Deployment used SSL to test the applications in same manner as production.

## Hints

The notes define how to recreate certificates and SHOULD NOT used by the user of Local Deployment.
This is just a memo.


### Generate [private keys](https://en.wikipedia.org/wiki/Public-key_cryptography)
```bash
openssl genrsa -out ../ssl.local/ca.key 4096
openssl genrsa -out ../ssl.local/postgres.key 4096
openssl genrsa -out ../ssl.local/rabbitmq.key 4096
openssl genrsa -out ../ssl.local/redis.key 4096
```

### Create your own CA Certificate
```bash
openssl req -new -x509 -days 3650 -subj "/C=UA/ST=Kyiv/L=Kyiv/O=oidc/OU=Development/CN=oidc Local Deployment/emailAddress=dev@in.cwtest.online" -key ../ssl.local/ca.key -out ca.crt
```

### Generate certs (https://en.wikipedia.org/wiki/Certificate_signing_request)
* Postgres
    ```bash
    openssl req -new -subj "/C=UA/ST=Kyiv/L=Kyiv/O=oidc/OU=Development/CN=postgres/emailAddress=dev@in.cwtest.online" -key ../ssl.local/postgres.key -out postgres.csr
    openssl x509 -req -sha256 -in postgres.csr -CA ca.crt -CAkey ../ssl.local/ca.key -CAcreateserial -CAserial ca.serial -days 365 -out postgres.crt
    ```
* RabbitMQ
    ```bash
    ../misc/v3ext-gen-infra.sh rabbitmq
    openssl req -new -subj "/C=UA/ST=Kyiv/L=Kyiv/O=oidc/OU=Development/CN=rabbitmq/emailAddress=dev@in.cwtest.online" -key ../ssl.local/rabbitmq.key -out rabbitmq.csr
    openssl x509 -req -sha256 -in rabbitmq.csr -CA ca.crt -CAkey ../ssl.local/ca.key -CAcreateserial -CAserial ca.serial -days 365 -extfile rabbitmq-tls.cnf -out rabbitmq.crt
    rm rabbitmq.csr rabbitmq-tls.cnf
    ```
* Redis
    ```bash
    openssl req -new -subj "/C=UA/ST=Kyiv/L=Kyiv/O=oidc/OU=Development/CN=redis/emailAddress=dev@in.cwtest.online" -key ../ssl.local/redis.key -out redis.csr
    openssl x509 -req -sha256 -in redis.csr -CA ca.crt -CAkey ../ssl.local/ca.key -CAcreateserial -CAserial ca.serial -days 365 -out redis.crt
    ```
