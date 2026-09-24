import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(dir, "index.html"),
    path.join(dir, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 18px rgba(34, 211, 238, 0.45)",
        amber: "0 0 18px rgba(251, 191, 36, 0.45)",
      },
    },
  },
  plugins: [],
};
