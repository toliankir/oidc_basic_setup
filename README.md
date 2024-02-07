# Oidc basic setup

## Get Started

### Clone the repository
```shell
git clone --branch workspace git@github.com:toliankir/oidc_basic_setup.git
cd oidc_basic_setup
```

### Initialize worktree by execute following commands
```shell
git worktree add oidc-service oidc-service-master
git worktree add api-service api-service-master
git worktree add deployment deployment
git worktree add client client-master
git worktree add message-api-service message-api-service-master
```

### Open VSCode Workspace
```shell
code "oidc.code-workspace"
```

### Add new orphan branch

```shell
NEW_BRANCH=...
git worktree add --detach "./${NEW_BRANCH}"
cd "./${NEW_BRANCH}"
git checkout --orphan "${NEW_BRANCH}"
git reset --hard
git commit --allow-empty -m "Initial Commit"
git push origin "${NEW_BRANCH}"
```
