import knex from "knex";
import env from "../config/env/env.js";

const config = {
  client: "pg",
  connection: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
  migrations: {
    directory: "./src/postgres/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./src/postgres/seeds",
    extension: "ts",
  },
};

const db = knex(config);

export default db;