import app from "./app.js";
import { sql } from "./config/db.js";

const PORT = process.env.PORT

const result = await sql.query("SELECT COUNT(*) FROM documents");
console.log(result.rows[0]);

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});

