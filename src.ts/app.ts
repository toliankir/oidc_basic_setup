import express from 'express';
import { configuration } from './oidc/configuration';
import Provider from 'oidc-provider';
import { FCancellationExecutionContext, FCancellationToken, FExecutionContext, FLogger, FLoggerConsole, FLoggerLevel } from '@freemework/common';
import RedisAdapter from './adapters/redis';
import getDbFactory from './data/postgres';
import { oidcRoutes } from './routes/oidc';
import { DatabaseFactory } from './data/database_factory';
import { appRoutes } from './routes/app';
import cors from 'cors';

const adapter = RedisAdapter;

FLogger.setLoggerFactory((name: string): FLogger => FLoggerConsole.create(name, {
	level: FLoggerLevel.INFO,
	format: "text"
}));

const port = process.env.PORT || 4000;
FExecutionContext.setDefaultExecutionContext(new FCancellationExecutionContext(FExecutionContext.Empty, FCancellationToken.Dummy));

const executionContext:FExecutionContext = FExecutionContext.Default;
const oidcProvider = new Provider(`http://localhost:${port}`, { ...configuration, adapter: (adapter as any)});
const dbFactory: DatabaseFactory = await getDbFactory();

const app: express.Application = express();

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(cors());
app.use((req, res, next) => {
  (req as any).executionContext = executionContext;
  (req as any).dbFactory = dbFactory;
  next();
});
app.use('/oidc', oidcProvider.callback());
app.use((req, res, next) => {
    const orig = res.render;
    // you'll probably want to use a full blown render engine capable of layouts
    res.render = (view, locals) => {
      app.render(view, locals, (err, html) => {
        if (err) throw err;
        orig.call(res, '_layout', {
          ...locals,
          body: html,
        } as any);
      });
    };
    next();
  });


appRoutes(app);
oidcRoutes(app, oidcProvider);  

app.listen(port, () => {
	console.log(`Oidc service listening on port ${port}`);
});
