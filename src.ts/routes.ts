import express from 'express';
import { tokenMiddleware } from './middleware';
import { userService } from './service/user.service';

const addRoutes = (app: express.Application) => {
	app.get("/time", tokenMiddleware, (req: express.Request, res: express.Response) => {
		res.set("Content-Type", "application/json");
		res.send(JSON.stringify({ time: Date.now() }));
		res.end();
	});

	app.get("/user", tokenMiddleware, async (req: express.Request, res: express.Response) => {
		const {userUuid} = (req as any).token;

		const user = await userService.getUser(userUuid);

		res.set("Content-Type", "application/json");
		res.send(JSON.stringify(user));
		res.end();
	});


	app.post("/user", async (req: express.Request, res: express.Response) => {
		res.set("Content-Type", "application/json");

		const { login, password } = req.body;

		try {
			if (!login) {
				throw new Error("Required parameter 'login' is missged")
			}
			if (!password) {
				throw new Error("Required parameter 'password' is missged")
			}

			const userModel = await userService.addUser(login, password);

			res.set("Content-Type", "application/json");
			res.send(JSON.stringify({ id: userModel.uuid, login }));
			res.end();
		} catch (err) {
			const errorMessage = (err instanceof Object && "message" in err) ? err.message : null;
			res.status(500);
			if (errorMessage) {
				res.send(JSON.stringify({ error: errorMessage }));
			}
			res.end();
		}
	})
}

export { addRoutes };
