import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const built = path.join(dist, "index.html");

if (!existsSync(built)) {
  console.error("Không thấy dist/index.html — build đã thất bại.");
  process.exit(1);
}

rmSync(path.join(root, "assets"), { recursive: true, force: true });
cpSync(built, path.join(root, "index.html"));
cpSync(path.join(dist, "assets"), path.join(root, "assets"), { recursive: true });
cpSync(path.join(dist, ".nojekyll"), path.join(root, ".nojekyll"));
const favicon = path.join(dist, "favicon.svg");
if (existsSync(favicon)) cpSync(favicon, path.join(root, "favicon.svg"));
console.log("Đã xuất bản index.html và assets/ cho GitHub Pages (nhánh main, thư mục gốc).");
