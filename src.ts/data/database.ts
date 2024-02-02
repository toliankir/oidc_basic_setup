import { FExecutionContext, FInitableBase } from "@freemework/common";

export abstract class Database extends FInitableBase {
	public abstract transactionCommit(executionContext: FExecutionContext): Promise<void>;
	public abstract transactionRollback(executionContext: FExecutionContext): Promise<void>;
	public abstract getUser(executionContext: FExecutionContext, login: string): Promise<{
		readonly uuid: string;
		readonly login: string;
		readonly password: string;
	} | null>;
}

export namespace Database {
}
