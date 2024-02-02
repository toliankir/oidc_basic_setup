import { FExecutionContext } from "@freemework/common";
import { PostgresDatabaseFactory } from "./postgres/postgres_database_factory";

let dbFactory: Promise<PostgresDatabaseFactory> | null = null;
// const dbFactory = new PostgresDatabaseFactory(new URL(process.env.PG_URL!));
// await dbFactory.init(FExecutionContext.Default);

export default function getDbFactory() {
    if (dbFactory === null) {
        const dbFactoryTemp = new PostgresDatabaseFactory(new URL(process.env.PG_URL!));
        dbFactory = dbFactoryTemp.init(FExecutionContext.Default).then(() =>  dbFactoryTemp);
    }
    return dbFactory;
}