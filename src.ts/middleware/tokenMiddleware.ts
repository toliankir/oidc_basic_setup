import express from "express";
import * as jose from "jose";
import { jwks } from "../init";

export const tokenMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const tokenHeaderValue: string | undefined = req.headers.authorization;
	if (!tokenHeaderValue) {
		res.status(403);
		res.send(JSON.stringify({ error: "Auth token must be set" }));
		res.end();
		return;
	}

	const [tokenType, token] = tokenHeaderValue.split(" ");
	if (tokenType !== 'Bearer') {
		res.status(403);
		res.send(JSON.stringify({ error: "Incorrect auth token type" }));
		res.end();
		return;
	}

	if (jwks === null) {
		res.status(500);
		res.end();
		return;
	}

	try {
		const tokenDecoded = await jose.jwtVerify(token, jwks);
		(req as any)["token"] = {
			userUuid: tokenDecoded.payload.sub,
		}
	} catch (err: unknown) {
		const message = (err instanceof Object && "message" in err) ? `, ${err.message}` : "";
		res.status(403);
		res.send(JSON.stringify({ error: `Invalid auth token${message}` }));
		res.end();
	}

	next();
}