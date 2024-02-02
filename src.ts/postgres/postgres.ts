import { DataSource } from "typeorm";
import { User } from "./models/user.model";

const pgConnection = process.env.PG_URL;
if (!pgConnection) {
	throw new Error("Startup misconfiguration, set PG_URL value");
}
const pgUrl = new URL(pgConnection);

export const postgresDataSource = new DataSource({
    type: "postgres",
    host: pgUrl.hostname,
    port: parseInt(pgUrl.port, 10),
    username: pgUrl.username,
    password: pgUrl.password,
    database: pgUrl.pathname.split('/')[1],
    synchronize: false,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})
