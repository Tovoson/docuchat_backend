import sql from "../config/db.js";

export const deleteAllDocuments = async () => {
  try {
    await sql`DELETE FROM documents`;
    console.log("✅ All documents deleted");
  } catch (error) {
    console.error("❌ Error deleting documents:", error);
  }
};
