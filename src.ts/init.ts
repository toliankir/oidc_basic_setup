import * as jose from "jose";
import { postgresDataSource } from "./postgres/postgres";

export type jwksKeys = (protectedHeader?: jose.JWSHeaderParameters | undefined, token?: jose.FlattenedJWSInput | undefined) => Promise<jose.KeyLike>;

export let jwks: null | jwksKeys = null;

export const initApp = async (oidcUrl: URL) => {
	try {
		jwks = await jose.createRemoteJWKSet(oidcUrl);
	} catch (err) {
		const message = (err instanceof Object && "message" in err) ? `: ${err.message}` : "";
		throw new Error(`Can not load jwks from ${oidcUrl.toString()}${message}`);
	}

	await postgresDataSource.initialize();
}

