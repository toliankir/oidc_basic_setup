import { Application, Express, urlencoded } from 'express';
import Provider from 'oidc-provider';
import { DatabaseFactory } from '../data/database_factory';
import { FExecutionContext } from '@freemework/common';
import { Database } from '../data/database';
import bcrypt from "bcrypt";

function setNoCache(req: any, res: any, next: any) {
	res.set('cache-control', 'no-store');
	next();
}

const body = urlencoded({ extended: false });

export const oidcRoutes = (expressApp: Application, oidcProvider: Provider) => {
	expressApp.get('/interaction/:uid', setNoCache, async (req, res, next) => {
		try {
			const {
				uid, prompt, params, session,
			} = await oidcProvider.interactionDetails(req, res);

			const client = await oidcProvider.Client.find((params as any).client_id);

			switch (prompt.name) {
				case 'login': {
					return res.render('login', {
						client,
						uid,
						details: prompt.details,
						params,
						title: 'Sign-in',
						session: session, // ? debug(session) : undefined,
						dbg: {
							params: JSON.stringify(params),
							prompt: JSON.stringify(prompt),
						},
					});
				}
				case 'consent': {
					return res.render('interaction', {
						client,
						uid,
						details: prompt.details,
						params,
						title: 'Authorize',
						session: session, // ? debug(session) : undefined,
						dbg: {
							params: JSON.stringify(params),
							prompt: JSON.stringify(prompt),
						},
					});
				}
				default:
					return undefined;
			}
		} catch (err) {
			return next(err);
		}
	});

	expressApp.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
		try {
			const { prompt: { name } } = await oidcProvider.interactionDetails(req, res);
			const { login, password } = req.body;
			const result = {
				login: {
					accountId: "user.uuid",
				},
			};
			await oidcProvider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });

			// const dbFactory: DatabaseFactory = (req as any).dbFactory;
			// const executionContext: FExecutionContext = (req as any).executionContext;
			// const user = await dbFactory.using(executionContext, (async (db: Database) => await db.getUser(executionContext, login)));

			// if (user === null) {
			// 	return res.redirect('/wrong-user');
			// }

			// const equal: boolean = await bcrypt.compare(password, user.password);

			// if (equal) {
			// 	const result = {
			// 		login: {
			// 			accountId: user.uuid,
			// 		},
			// 	};

			// 	await oidcProvider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
			// } else {
			// 	return res.redirect('/wrong-password');
			// }
		} catch (err) {
			next(err);
		}
	});


	expressApp.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
		try {
			const interactionDetails = await oidcProvider.interactionDetails(req, res);
			const { prompt: { name, details }, params, session: { accountId } } = interactionDetails as any;
			// assert.equal(name, 'consent');

			let { grantId } = interactionDetails;
			let grant;

			if (grantId) {
				// we'll be modifying existing grant in existing session
				grant = await oidcProvider.Grant.find(grantId);
			} else {
				// we're establishing a new grant
				grant = new oidcProvider.Grant({
					accountId,
					clientId: params.client_id,
				});
			}

			if (details.missingOIDCScope) {
				grant!.addOIDCScope(details.missingOIDCScope.join(' '));
			}
			if (details.missingOIDCClaims) {
				grant!.addOIDCClaims(details.missingOIDCClaims);
			}
			if (details.missingResourceScopes) {
				for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
					grant!.addResourceScope(indicator, (scopes as any).join(' '));
				}
			}

			grantId = await grant!.save();

			const consent = {};
			if (!interactionDetails.grantId) {
				// we don't have to pass grantId to consent, we're just modifying existing one
				(consent as any).grantId = grantId;
			}

			const result = { consent };
			await oidcProvider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
		} catch (err) {
			next(err);
		}
	});


	expressApp.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
		try {
			const result = {
				error: 'access_denied',
				error_description: 'End-User aborted interaction',
			};
			await oidcProvider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
		} catch (err) {
			next(err);
		}
	});
}
