const settings = {
    authority: "http://localhost:4000/oidc/.well-known/openid-configuration",
    client_id: "oidc_client",
    redirect_uri: "http://localhost:3000/cb",
    response_type: "code",
    client_secret: "a_different_secret",
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
};

const userManager = new Oidc.UserManager(settings);
