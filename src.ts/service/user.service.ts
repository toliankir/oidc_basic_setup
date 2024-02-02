import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { postgresDataSource } from "../postgres/postgres";
import { User } from "../postgres/models/user.model";
import { randomUUID } from "crypto";


export class UserService {
	private readonly SALT_ROUNDS = 12;
	constructor(private readonly postgres: DataSource) { }

	public async addUser(login: string, password: string): Promise<{
		readonly login: string;
		readonly uuid: string;
	}> {
		const userRepository = this.postgres.getRepository(User)

		const existingUser = await userRepository.findOne({ where: { login } });
		if (existingUser) {
			throw new Error("User already exists");
		}
		const newUserUuid = randomUUID();
		const encryptedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
		await userRepository.save({ login, password: encryptedPassword, uuid: newUserUuid });

		return {
			login,
			uuid: newUserUuid
		}
	}
}

export const userService = new UserService(postgresDataSource);
