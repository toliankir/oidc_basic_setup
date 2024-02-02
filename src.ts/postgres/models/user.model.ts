import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity("user")
export class User {
	@PrimaryColumn({ name: "id" })
	id!: number

	@Column({ type: "uuid", name: "uuid" })
	uuid!: string

	@Column({ type: "varchar", length: 64, name: "login" })
	login!: string

	@Column({ type: "text", name: "password" })
	password!: string
}
