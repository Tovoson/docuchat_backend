import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString!, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export default sql;
