import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

const client = new TextServiceClient({
  // Tu peux passer la clé ici si la lib le supporte
  apiKey: process.env.GOOGLE_API_KEY,
});

export default eslintConfig;
