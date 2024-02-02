import express from 'express';
import { addRoutes } from './routes';
import { initApp } from './init';
import * as  bodyParser from "body-parser"


const port = process.env.PORT;
const oidcProviderUrl = process.env.OIDC_PROVIDER_URL;
if (!port) {
	throw new Error("Startup misconfiguration, set PORT value");
}
if (!oidcProviderUrl) {
	throw new Error("Startup misconfiguration, set OIDC_PROVIDER_URL value");
}

const app: express.Application = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

initApp(new URL(oidcProviderUrl));
addRoutes(app);

app.listen(port, () => {
	console.log(`Api service start on port ${port}`);
});
