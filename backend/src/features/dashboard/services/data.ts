import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

// 1. Get the absolute path to this file (using fileURLToPath)
const __filename = fileURLToPath(import.meta.url);

// 2. Get the directory name from the file path (equivalent to old __dirname)
const __dirname = path.dirname(__filename);

export async function readJsonFile() {
  try {
    const filePath = path.join(__dirname, "MOCK_DATA.json");

    const data = await fs.readFile(filePath, "utf8");
    const jsonObject = JSON.parse(data);
    return jsonObject;
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    throw error;
  }
}
