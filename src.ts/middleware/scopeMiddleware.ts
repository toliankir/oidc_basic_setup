import express from "express";
import * as jose from "jose";

export const scopeMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const tokenHeaderValue: string | undefined = req.headers.authorization;
	if (!tokenHeaderValue) {
		res.status(403);
		res.send("Error: Auth token must be set");
		res.end();
		return;
	}

	const [tokenType, token] = tokenHeaderValue.split(" ");
	if (tokenType !== 'Bearer') {
		res.status(403);
		res.send("Error: Incorrect auth token type");
		res.end();
		return;
	}

	try {
		const tokenObj = await jose.decodeJwt(token);
	} catch (err: unknown) {
		const message = (err instanceof Object && "message" in err) ? `: ${err.message}` : "";
		res.status(403);
		res.send(`Error: Invalid auth token${message}`);
		res.end();
	}

	next();
}
