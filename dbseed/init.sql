CREATE TABLE "public"."user" (
    "id" SERIAL,
    "uuid" UUID NOT NULL,
    "login" VARCHAR(256) NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "uq__user__uuid" UNIQUE ("uuid"),
    CONSTRAINT "uq__user__login" UNIQUE ("login")
);

ALTER TABLE "public"."user" OWNER TO "postgres";