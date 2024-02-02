import express from 'express';
import { tokenMiddleware } from './middleware';
import { User } from './postgres/models/user.model';
import { postgresDataSource } from './postgres/postgres';
import { randomUUID } from 'crypto';
import { userService } from './service/user.service';

const addRoutes = (app: express.Application) => {
	app.get("/time", tokenMiddleware, (req: express.Request, res: express.Response) => {
		res.set("Content-Type", "application/json");
		res.send(JSON.stringify({ time: Date.now() }));
		res.end();
	});

	app.post("/user", async (req: express.Request, res: express.Response) => {
		res.set("Content-Type", "application/json");

		const { login, password } = req.body;

		try {
			const userModel= await userService.addUser(login, password);

			res.set("Content-Type", "application/json");
			res.send(JSON.stringify({ id: userModel.uuid, login }));
			res.end();
		} catch (err) {
			const message = (err instanceof Object && "message" in err) ? `: ${err.message}` : "";
			res.status(500);
			res.send(JSON.stringify({ error: `Internal error${message}` }));
			res.end();
		}
	})
}

export { addRoutes };
