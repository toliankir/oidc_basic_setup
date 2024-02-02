# Oidc Local Deployment

## Get started

* [ ] (Optionally) Create a file `startup.config.local`. Use this file for override startup configuration variables defined in the file `startup.config`.
* [ ] Up local deployment zone by call one of
  * `./up.sh [--force-pull] [-- <Docker Compose Arguments>]`
  * `./up.sh --force-pull -- --detach`
  * `./up.sh --force-pull; sleep 1; ./down.sh`
---

## Resources over port mapping

### Infra (on Docker host)

* [53001 pgAdmin](http://127.0.0.1:51001) (login as dev@in.cwtest.online/devel)
* [53003 Redis Commander](http://127.0.0.1:53103)
* 53011 PostgreSQL endpoint `postgres://devadmin@127.0.0.1:53111/devdb`
* 53013 Redis Endpoint `redis://127.0.0.1:53113`

## Known Issues

* pgAdmin does not setup servers list if stop initial launch

## Use cases

TDB

## Notes

### Docker

* Cleanup Docker volumes
    ```shell
    docker volume prune
    ```
* Cleanup Docker all (images, networks, volumes)
    ```shell
    docker system prune --all --volumes
    ```

### Follow Logs

```shell
docker logs --follow oidc-local-deployment-api-service-1
```