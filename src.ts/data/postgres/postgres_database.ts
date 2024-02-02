import { FSqlConnectionFactoryPostgres } from "@freemework/sql.postgres";

import * as _ from "lodash";

import { SqlDatabase } from "../sql_database";
import { FExecutionContext, FSqlResultRecord } from "@freemework/common";

export class PostgresDatabase extends SqlDatabase {
	public constructor(sqlConnectionFactory: FSqlConnectionFactoryPostgres) {
		super(sqlConnectionFactory);
	}

	public async getUser(executionContext: FExecutionContext, login: string): Promise<{
		readonly uuid: string;
		readonly login: string;
		readonly password: string;
	} | null> {
		const sqlRecord: FSqlResultRecord | null = await this.sqlConnection
			.statement(`
					SELECT * FROM "user" WHERE "login" = $1
				`)
			.executeSingleOrNull(
				executionContext,
				login
			);

		return sqlRecord === null ? null : {
			uuid: sqlRecord.get("uuid").asString,
			login: sqlRecord.get("login").asString,
			password: sqlRecord.get("password").asString,
		};
	}
}
