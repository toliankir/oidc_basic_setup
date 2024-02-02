import { Application } from "express";
import { Request, Response } from 'express';

export const appRoutes = (app: Application) => {
	app.get("/wrong-password", (req: Request, res: Response) => {
		res.render('wrong_password', {
			title: "Wrong password",
			uid: "", 
			client: {},
			session: {},
			dbg: {},
		});
	});

	app.get("/wrong-user", (req, res) => {
		res.render('wrong_user', {
			title: "Wrong user",
			uid: "",
			client: {},
			session: {},
			dbg: {},
		});
	})
}
